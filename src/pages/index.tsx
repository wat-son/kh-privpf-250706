import React from 'react';
import Link from 'next/link';
import { Container, Typography, Button, Box, Stack } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h3" gutterBottom>
        こんにちは！
      </Typography>

      <Typography variant="h6" color="text.secondary" gutterBottom>
        これは React + TypeScript で作ったポートフォリオです。
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        これから機能をどんどん追加していきますので、ぜひお楽しみに！
      </Typography>

      <Stack spacing={2} direction="column" alignItems="center">
        <Link href="/contact" passHref>
          <Button variant="contained" size="large">
            お問い合わせページへ
          </Button>
        </Link>

        <Link href="/survey" passHref>
          <Button variant="outlined" size="large" color="primary">
            アンケートサイトへ
          </Button>
        </Link>
      </Stack>
    </Container>
  );
};

export default HomePage;
