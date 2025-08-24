"use client"; // Next.js App Router の場合は必要
import { Button } from "@mui/material";
import { useRouter } from "next/navigation"; // App Router用
// pages routerの場合は "next/router" を使う

export default function ButtonBack() {
    const router = useRouter();

    return (
        <Button variant="outlined" onClick={() => router.back()}>
        戻る
        </Button>
    );
}
