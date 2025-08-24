import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";
import * as bcrypt from "bcryptjs";

// DynamoDB接続設定
const dynamo = new DynamoDBClient({ region: "ap-northeast-1" });
const docClient = DynamoDBDocument.from(dynamo);

// ユーザーテーブルの検索
async function findUserByEmail(email: string) {
    const res = await docClient.send(
        new GetCommand({
        TableName: "Users",
        Key: { email }, // PKがemailの場合
        })
    );
    return res.Item || null;
}

export const authOptions: AuthOptions = {
    adapter: DynamoDBAdapter(docClient),
    providers: [
        CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) return null;

            const user = await findUserByEmail(credentials.email);
            if (user && bcrypt.compareSync(credentials.password, user.passwordHash)) {
            return { id: user.id, email: user.email, name: user.name };
            }
            return null;
        }
        })
    ],
    session: {
        strategy: "jwt" as const
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
