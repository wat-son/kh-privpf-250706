// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// DynamoDB クライアント
const client = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // 1. メールの重複チェック
        const existingUsers = await ddbDocClient.send(
        new ScanCommand({
            TableName: "Users",
            FilterExpression: "#email = :email",
            ExpressionAttributeNames: { "#email": "email" },
            ExpressionAttributeValues: { ":email": email },
            Limit: 1,
        })
        );

        if (existingUsers.Count && existingUsers.Count > 0) {
        return res.status(400).json({ message: "Email already exists" });
        }

        // 2. パスワードをハッシュ化
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. UUID を生成
        const userId = uuidv4();

        // 4. DynamoDB に保存
        const command = new PutCommand({
        TableName: "Users",
        Item: {
            id: userId,
            name,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        },
        });

        await ddbDocClient.send(command);

        return res.status(201).json({ message: "User registered successfully", userId });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
