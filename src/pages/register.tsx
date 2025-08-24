import { useState } from "react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage("✅ 登録に成功しました！");
        } else {
            setMessage(`❌ エラー: ${data.message}`);
        }
        } catch (err) {
        setMessage("❌ サーバーエラー");
        }
    };

    return (
        <div className="flex flex-col items-center mt-10">
        <h1 className="text-xl font-bold mb-4">ユーザー登録</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-64">
            <input
            type="text"
            placeholder="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2"
            />
            <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2"
            />
            <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            登録
            </button>
        </form>
        {message && <p className="mt-4">{message}</p>}
        </div>
    );
}
