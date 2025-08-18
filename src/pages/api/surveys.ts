// pages/api/surveys.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION }));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
        const body = req.body;
        // TODO: バリデーションを追加（title 必須など）
        const item = {
            surveyId: body.surveyId,
            title: body.title,
            description: body.description,
            status: body.status,
            questions: body.questions,
            createdAt: body.createdAt ?? new Date().toISOString(),
        };
        await ddb.send(new PutCommand({ TableName: process.env.SURVEYS_TABLE!, Item: item }));
        return res.status(201).json({ ok: true, surveyId: item.surveyId });
        } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "server_error" });
        }
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
}
