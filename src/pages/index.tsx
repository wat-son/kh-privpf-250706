// pages/index.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Button, Stack } from '@mui/material';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';

const HomePage: React.FC = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <Header userName={session?.user?.name ?? undefined} />
      <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h3" gutterBottom>
          こんにちは、{session?.user?.name ? `${session.user.name}さん` : "！"}
        </Typography>

        <Typography variant="h6" color="text.secondary" gutterBottom>
          これは React + TypeScript で作ったポートフォリオです。
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          {session
            ? "ログイン中です．これから機能をどんどん追加していきますのでお楽しみに！"
            : "ログインしていませんがトップページを閲覧できます．"
            }
        </Typography>

        <Stack spacing={2} direction="column" alignItems="center">
          <Link href="/survey" passHref>
            <Button variant="contained" size="large" color="primary">
              アンケートサイトへ
            </Button>
          </Link>
          <Link href="/contact" passHref>
            <Button variant="outlined" size="large">
              お問い合わせページへ
            </Button>
          </Link>
        </Stack>
      </Container>
    </>
  );
};
export default HomePage;