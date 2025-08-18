import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

const Header: React.FC = () => {
    const textColor = 'white';

    return (
        <AppBar position="static">
        <Toolbar>
            <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: textColor }}
            >
            ポートフォリオサイト
            </Typography>
            <Link href="/" passHref>
            <Button sx={{ color: textColor }}>ホーム</Button>
            </Link>
            <Link href="/contact" passHref>
            <Button sx={{ color: textColor }}>お問い合わせ</Button>
            </Link>
        </Toolbar>
        </AppBar>
    );
};


export default Header;
