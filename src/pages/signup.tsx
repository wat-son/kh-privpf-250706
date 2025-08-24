// pages/signup.tsx
import { useState } from "react";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        });

        if (res.ok) {
        setMessage("登録に成功しました！");
        setName("");
        setEmail("");
        setPassword("");
        } else {
        const data = await res.json();
        setMessage(data.error || "登録に失敗しました");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
        <h1>ユーザー登録</h1>
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ display: "block", margin: "10px 0", width: "100%" }}
            />
            <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: "block", margin: "10px 0", width: "100%" }}
            />
            <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: "block", margin: "10px 0", width: "100%" }}
            />
            <button type="submit">登録</button>
        </form>
        {message && <p>{message}</p>}
        </div>
    );
}
