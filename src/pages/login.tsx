import React, { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { Button, TextField, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        });

        if (res?.error) {
        setMessage("❌ ログインに失敗しました");
        setError(res.error);
        } else {
        setMessage("✅ ログイン成功！");
        router.push("/"); // ログイン成功でトップ画面へ
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 10 }}>
        <Typography variant="h5" gutterBottom>
            ログイン
        </Typography>

        <form onSubmit={handleLogin}>
            <Stack spacing={2}>
            <TextField
                label="メールアドレス"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <TextField
                label="パスワード"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <Button type="submit" variant="contained">
                ログイン
            </Button>
            </Stack>
        </form>

        {error && <Typography color="error">{error}</Typography>}

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Link href="/register" passHref>
                <Button variant="outlined">アカウント登録</Button>
            </Link>
            <Link href="/" passHref>
                <Button variant="outlined">ログインせずにトップへ</Button>
            </Link>
        </Stack>
        </Container>
    );
}