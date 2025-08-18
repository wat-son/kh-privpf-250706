import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

type Form = { name: string; email: string; message: string };

const ContactForm: React.FC = () => {
    const [form, setForm] = useState<Form>({ name: "", email: "", message: "" });
    const [status, setStatus] = useState<string>("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL!;
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("送信中...");
        try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            },
            body: JSON.stringify(form),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("非OKレスポンス:", res.status, text);
            setStatus("送信に失敗しました");
            return;
        }

        const data = await res.json();
        console.log("成功:", data);
        setStatus("送信が完了しました！");
        setForm({ name: "", email: "", message: "" });
        } catch (err) {
        console.error("送信エラー:", err);
        setStatus("エラーが発生しました");
        }
    };

    return (
        <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
            maxWidth: 500,
            mx: "auto",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            bgcolor: "background.paper",
            boxShadow: 3,
            borderRadius: 2,
        }}
        >
        <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
            お問い合わせフォーム
        </Typography>

        <TextField
            label="名前"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
        />

        <TextField
            label="メールアドレス"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
        />

        <TextField
            label="メッセージ"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            multiline
            rows={4}
        />

        <Button variant="contained" type="submit" size="large">
            送信
        </Button>

        {status && (
            <Typography
            variant="body1"
            color={
                status === "送信が完了しました！"
                ? "success.main"
                : "error.main"
            }
            textAlign="center"
            mt={1}
            >
            {status}
            </Typography>
        )}
        </Box>
    );
};

export default ContactForm;
