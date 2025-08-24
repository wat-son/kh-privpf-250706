import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import {
    Button,
    TextField,
    Container,
    Stack,
    Typography,
    Paper,
    } from "@mui/material";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [currentImage, setCurrentImage] = useState(0);

    // 背景用の画像リスト（publicフォルダに配置）
    const images = ["/login-1.jpg", "/login-2.jpg", "/login-3.jpg"];

    // 一定間隔で画像を切り替える
    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        }, 10000); // 5秒ごとに切り替え
        return () => clearInterval(interval);
    }, [images.length]);

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
        setMessage("❌ Failed to login.");
        setError(res.error);
        } else {
        setMessage("✅ Success");
        router.push("/"); // ログイン成功でトップ画面へ
        }
    };

    return (
        <div
        style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden",
        }}
        >
        {/* 背景画像スライドショー */}
        {images.map((img, index) => (
            <div
            key={index}
            style={{
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: currentImage === index ? 1 : 0,
                transition: "opacity 1.5s ease-in-out",
            }}
            />
        ))}

        {/* 中央のフォーム */}
        <Container
            maxWidth="xs"
            sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            }}
        >
            <Paper
            elevation={6}
            sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(6px)",
            }}
            >
            <Typography variant="h5" gutterBottom align="center">
                Login
            </Typography>

            <form onSubmit={handleLogin}>
                <Stack spacing={2}>
                <TextField
                    label="mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" fullWidth>
                    Enter
                </Button>
                </Stack>
            </form>

            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                {error}
                </Typography>
            )}
            {message && (
                <Typography color="primary" sx={{ mt: 1 }}>
                {message}
                </Typography>
            )}

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Link href="/register" passHref>
                <Button variant="outlined" fullWidth>
                    Sign up
                </Button>
                </Link>
                <Link href="/" passHref>
                <Button variant="outlined" fullWidth>
                    Top
                </Button>
                </Link>
            </Stack>
            </Paper>
        </Container>
        </div>
    );
}
