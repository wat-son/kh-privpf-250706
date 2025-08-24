// pages/api/signup.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    } from "@aws-sdk/lib-dynamodb";

    const client = new DynamoDBClient({ region: "ap-northeast-1" });
    const ddb = DynamoDBDocumentClient.from(client);

    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "全ての項目を入力してください" });
    }

    try {
        // すでにメールが存在するかチェック
        const existingUser = await ddb.send(
        new GetCommand({
            TableName: "Users",
            Key: { email },
        })
        );

        if (existingUser.Item) {
        return res.status(400).json({ error: "このメールアドレスは既に登録されています" });
        }

        // パスワードをハッシュ化
        const hashedPassword = await bcrypt.hash(password, 10);

        // ユーザー作成
        const newUser = {
        id: uuidv4(),
        name,
        email,
        passwordHash: hashedPassword,
        createdAt: new Date().toISOString(),
        };

        await ddb.send(
        new PutCommand({
            TableName: "Users",
            Item: newUser,
        })
        );

        return res.status(200).json({ message: "ユーザー登録が完了しました" });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "サーバーエラーが発生しました" });
    }
}
