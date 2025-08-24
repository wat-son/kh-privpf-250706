// src/hooks/useAuth.ts
import { useSession, signOut } from "next-auth/react";

export function useAuth() {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";
    const isAuthenticated = !!session;

    return { session, isAuthenticated, isLoading, signOut };
}
