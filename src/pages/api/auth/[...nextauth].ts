// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

// DynamoDB クライアント
const client = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

export default NextAuth({
    providers: [
        CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) return null;

            // DynamoDB からユーザーを取得
            const result = await ddbDocClient.send(
            new ScanCommand({
                TableName: "Users",
                FilterExpression: "#email = :email",
                ExpressionAttributeNames: { "#email": "email" },
                ExpressionAttributeValues: { ":email": credentials.email },
                Limit: 1,
            })
            );

            const user = result.Items?.[0];
            if (!user) return null;

            // パスワードを bcrypt で照合
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (!isValid) return null;

            // セッションに渡すユーザー情報
            return { id: user.id, name: user.name, email: user.email };
        },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login", // 任意のログインページ
    },
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
});
