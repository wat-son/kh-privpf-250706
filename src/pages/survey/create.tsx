import React, { useState } from "react";
import {
    Container, Typography, Box, TextField, Button, Stack,
    Paper, IconButton, Select, MenuItem, FormControl, InputLabel,
    FormControlLabel, Checkbox
    } from "@mui/material";
    import AddIcon from "@mui/icons-material/Add";
    import DeleteIcon from "@mui/icons-material/Delete";

    type QuestionType = "text" | "textarea" | "radio" | "checkbox" | "select" | "rating";

    type Question = {
    id: string;
    type: QuestionType;
    label: string;
    required?: boolean;
    options?: string[]; // radio/select/checkbox 用
    };

    const makeId = () =>
    (typeof crypto !== "undefined" && (crypto as any).randomUUID
        ? (crypto as any).randomUUID()
        : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

    const API_URL = process.env.NEXT_PUBLIC_SURVEY_API_URL; // 例: https://xxxxx.execute-api.ap-northeast-1.amazonaws.com/prod
    // const API_URL = "https://iwy9oz1bf0.execute-api.us-east-1.amazonaws.com/dev"; // 例: https://xxxxx.execute-api.ap-northeast-1.amazonaws.com/prod
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY; // 開発中のみ（本番はNG）

export default function SurveyCreatePage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<"draft" | "published">("draft");
    const [questions, setQuestions] = useState<Question[]>([]);

    const addQuestion = (type: QuestionType = "text") => {
        setQuestions((q) => [
        ...q,
        { id: makeId(), type, label: "", required: false, options: type === "radio" || type === "select" || type === "checkbox" ? ["選択肢1"] : undefined },
        ]);
    };

    const removeQuestion = (id: string) => setQuestions((q) => q.filter((x) => x.id !== id));

    const updateQuestion = (id: string, patch: Partial<Question>) =>
        setQuestions((q) => q.map((it) => (it.id === id ? { ...it, ...patch } : it)));

    const addOption = (qid: string) =>
        updateQuestion(qid, { options: [...(questions.find((x) => x.id === qid)?.options ?? []), ""] });

    const updateOption = (qid: string, idx: number, val: string) => {
        const q = questions.find((x) => x.id === qid);
        if (!q || !q.options) return;
        const newOpts = [...q.options];
        newOpts[idx] = val;
        updateQuestion(qid, { options: newOpts });
    };

    const removeOption = (qid: string, idx: number) => {
        const q = questions.find((x) => x.id === qid);
        if (!q || !q.options) return;
        const newOpts = q.options.filter((_, i) => i !== idx);
        updateQuestion(qid, { options: newOpts });
    };

    // 送信を完了
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("タイトルを入力してください");
            return;
        }

        const payload = {
            surveyId: makeId(),
            title,
            description,
            status,
            questions,
            createdAt: new Date().toISOString(),
        };

        try {
            const res = await fetch(`${API_URL}/surveys`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(API_KEY ? { "x-api-key": API_KEY } : {}),
            },
            body: JSON.stringify(payload),
            });

            if (!res.ok) {
            const text = await res.text();
            console.error("非OK", res.status, text);
            alert("保存に失敗しました");
            return;
            }

            const data = await res.json();
            alert("保存しました: " + JSON.stringify(data));
            setTitle("");
            setDescription("");
            setQuestions([]);
        } catch (err) {
            console.error(err);
            alert("通信エラー");
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>アンケート作成</Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <TextField label="説明" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={3} />

            <FormControl fullWidth>
            <InputLabel id="status-label">状態</InputLabel>
            <Select labelId="status-label" value={status} label="状態" onChange={(e) => setStatus(e.target.value as any)}>
                <MenuItem value="draft">下書き</MenuItem>
                <MenuItem value="published">公開</MenuItem>
            </Select>
            </FormControl>

            <Stack direction="row" spacing={1}>
            <Button startIcon={<AddIcon />} onClick={() => addQuestion("text")}>自由記入</Button>
            <Button onClick={() => addQuestion("textarea")}>長文</Button>
            <Button onClick={() => addQuestion("radio")}>単一選択</Button>
            <Button onClick={() => addQuestion("checkbox")}>複数選択</Button>
            <Button onClick={() => addQuestion("select")}>ドロップダウン</Button>
            </Stack>

            {/* 質問リスト */}
            <Stack spacing={2}>
            {questions.map((q, qi) => (
                <Paper key={q.id} sx={{ p: 2, position: "relative" }}>
                <IconButton onClick={() => removeQuestion(q.id)} sx={{ position: "absolute", right: 8, top: 8 }}>
                    <DeleteIcon />
                </IconButton>

                <FormControl fullWidth sx={{ mb: 1 }}>
                    <TextField label={`質問 ${qi + 1} のラベル`} value={q.label} onChange={(e) => updateQuestion(q.id, { label: e.target.value })} />
                </FormControl>

                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel id={`type-${q.id}`}>タイプ</InputLabel>
                    <Select labelId={`type-${q.id}`} value={q.type} label="タイプ" onChange={(e) => {
                    const newType = e.target.value as QuestionType;
                    updateQuestion(q.id, { type: newType, options: (newType === "radio" || newType === "select" || newType === "checkbox") ? (q.options ?? ["選択肢1"]) : undefined });
                    }}>
                    <MenuItem value="text">短文（1行）</MenuItem>
                    <MenuItem value="textarea">長文（複数行）</MenuItem>
                    <MenuItem value="radio">単一選択</MenuItem>
                    <MenuItem value="checkbox">複数選択</MenuItem>
                    <MenuItem value="select">ドロップダウン</MenuItem>
                    <MenuItem value="rating">評価（星）</MenuItem>
                    </Select>
                </FormControl>

                <FormControlLabel control={<Checkbox checked={q.required ?? false} onChange={(e) => updateQuestion(q.id, { required: e.target.checked })} />} label="必須" />

                {/* 選択肢編集 */}
                {(q.type === "radio" || q.type === "select" || q.type === "checkbox") && (
                    <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2">選択肢</Typography>
                    {(q.options ?? []).map((opt, idx) => (
                        <Stack direction="row" spacing={1} alignItems="center" key={idx} sx={{ mt: 1 }}>
                        <TextField value={opt} onChange={(e) => updateOption(q.id, idx, e.target.value)} fullWidth />
                        <Button variant="outlined" onClick={() => removeOption(q.id, idx)}>削除</Button>
                        </Stack>
                    ))}
                    <Button sx={{ mt: 1 }} onClick={() => addOption(q.id)}>選択肢を追加</Button>
                    </Box>
                )}
                </Paper>
            ))}
            </Stack>

            <Box sx={{ display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained">保存して公開</Button>
            <Button variant="outlined" onClick={() => { setTitle(""); setDescription(""); setQuestions([]); }}>クリア</Button>
            </Box>
        </Box>
        </Container>
    );
}
