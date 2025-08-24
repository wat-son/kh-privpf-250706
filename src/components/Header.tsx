// components/Header.tsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface HeaderProps {
    userName?: string | null;
    }

const Header: React.FC<HeaderProps> = ({ userName }) => {
    const textColor = 'white';

    return (
        <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: textColor }}>
            ポートフォリオサイト
            </Typography>

            {userName && (
            <Typography sx={{ color: textColor, mr: 2 }}>
                {userName} さん
            </Typography>
            )}

            <Link href="/" passHref>
            <Button sx={{ color: textColor }}>ホーム</Button>
            </Link>
            <Link href="/contact" passHref>
            <Button sx={{ color: textColor }}>お問い合わせ</Button>
            </Link>

            {userName && (
            <Button sx={{ color: textColor, ml: 1 }} onClick={() => signOut({ callbackUrl: '/login' })}>
                ログアウト
            </Button>
            )}
        </Toolbar>
        </AppBar>
    );
};

export default Header;
