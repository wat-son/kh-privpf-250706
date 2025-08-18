// dynamoDBに保存する機能を追加
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const REGION = process.env.AWS_REGION || "us-east-1";
const TABLE_NAME = process.env.TABLE_NAME || "ContactMessages";

const client = new DynamoDBClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(client);

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*", // 本番は自分のドメインに限定推奨
    "Access-Control-Allow-Methods": "OPTIONS,POST",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key"
    };

    export const handler = async (event) => {
    console.log("Event:", JSON.stringify(event));

    // OPTIONS（プリフライト）対応
    if (event.httpMethod === "OPTIONS") {
        return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "CORS preflight OK" })
        };
    }

    // POST以外は拒否
    if (event.httpMethod !== "POST") {
        return {
        statusCode: 405,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Method Not Allowed" })
        };
    }

    // bodyをパース
    let body;
    try {
        body = event.body ? JSON.parse(event.body) : {};
    } catch (err) {
        console.error("JSON parse error:", err);
        return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Invalid JSON body" })
        };
    }

    const { name, email, message } = body;

    if (!name || !email || !message) {
        return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Missing required fields" })
        };
    }

    const item = {
        id: uuidv4(),
        name,
        email,
        message,
        createdAt: new Date().toISOString()
    };

    try {
        await ddb.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: item
        }));

        return {
        statusCode: 200,
        headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: "お問い合わせを保存しました。", id: item.id })
        };
    } catch (err) {
        console.error("DynamoDB Put error:", err);
        return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "サーバーエラーが発生しました。" })
        };
    }
};

// ウェブ上で送信完了のメッセージを確認
// export const handler = async (event) => {
//     console.log("Event:", event);

//     // プリフライト対応
//     if (event.httpMethod === "OPTIONS") {
//         return {
//         statusCode: 200,
//         headers: {
//             "Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Methods": "OPTIONS,POST",
//             "Access-Control-Allow-Headers": "Content-Type, x-api-key"
//         },
//         body: ""
//         };
//     }

//     if (event.httpMethod !== "POST") {
//         return {
//         statusCode: 405,
//         headers: {
//             "Access-Control-Allow-Origin": "*"
//         },
//         body: JSON.stringify({ message: "Method Not Allowed" })
//         };
//     }

//     const data = JSON.parse(event.body);
//     console.log("Received data:", data);

//     // DynamoDB 保存処理（例）
//     // const AWS = require("aws-sdk");
//     // const db = new AWS.DynamoDB.DocumentClient();
//     // await db.put({ TableName: "YourTable", Item: data }).promise();

//     return {
//         statusCode: 200,
//         headers: {
//         "Access-Control-Allow-Origin": "*"
//         },
//         body: JSON.stringify({ message: "Success" })
//     };
// };