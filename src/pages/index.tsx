// pages/index.tsx
import React from 'react';
import {
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Box,
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';

const HomePage: React.FC = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <Header userName={session?.user?.name ?? undefined} />

      {/* 背景画像を敷いたエリア */}
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: "url('/top-bg.jpg')", // public/background.jpg を用意してください
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          pt: 8,
          pb: 8,
        }}
      >
      {/* 黒のオーバーレイ */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.65)", // 半透明の黒
          zIndex: 1,
        }}
      />
        <Container maxWidth="md" sx={{ textAlign: 'center', position: "relative", zIndex: 2 }}>
          <Typography variant="h3" gutterBottom sx={{ color: 'white', textShadow: '0px 2px 6px rgba(0,0,0,0.7)' }}>
            Hello, {session?.user?.name ? `${session.user.name}` : "！"}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ color: 'white', textShadow: '0px 1px 4px rgba(0,0,0,0.6)' }}>
            This is a portfolio I made with React + TypeScript.
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, color: 'white', textShadow: '0px 1px 4px rgba(0,0,0,0.6)' }}>
            {session
              ? "You are signed in. More updates are to be added!"
              : "You are not signed in but you can still visit Top page."
            }
          </Typography>

          <Stack spacing={4} direction="column" alignItems="center">
            {/* Survey カード */}
            <Link href="/survey" passHref style={{ textDecoration: "none", width: "100%", maxWidth: 400 }}>
              <Card 
                sx={{
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="180"
                    image="/top-survey_card.jpg" // public/survey.jpg を配置してください
                    alt="Survey"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Survey
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This is a survey site. You can make your own survey and share it with others. Also you can answer to the surveys you have been assigned to.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>

            {/* FAQ ボタン */}
            <Link href="/contact" passHref>
              <Button variant="outlined" size="large"
                sx={{
                  color: "white", borderColor: "white",
                  mt: 2,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.08)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                  },
                }}
              >
                FAQ
              </Button>
            </Link>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
