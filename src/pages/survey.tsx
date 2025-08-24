import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import Grid from "@mui/material/Grid"
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';

const SurveyHomePage: React.FC = () => {
    const { session, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // ログインしていなければログイン画面へリダイレクト
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
        router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !isAuthenticated) return <p>Loading...</p>;

    return (
        <>
        <Header userName={session?.user?.name ?? undefined} />
            <Container maxWidth="md" sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom align="center">
                アンケートサイト
            </Typography>

            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                ここではアンケートの作成や回答ができます。
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6} {...({} as any)}>
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                    <Typography variant="h6" gutterBottom>
                        アンケートを作成
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        新しいアンケートを作って、回答を集めましょう。
                    </Typography>
                    </CardContent>
                    <CardActions>
                    <Link href="/survey/create" passHref>
                        <Button variant="contained" fullWidth>
                        作成ページへ
                        </Button>
                    </Link>
                    </CardActions>
                </Card>
                </Grid>

                <Grid item xs={12} md={6} {...({} as any)}>
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                    <Typography variant="h6" gutterBottom>
                        アンケートに回答
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        公開されているアンケートに回答してみましょう。
                    </Typography>
                    </CardContent>
                    <CardActions>
                    <Link href="/survey/list" passHref>
                        <Button variant="outlined" fullWidth>
                        回答ページへ
                        </Button>
                    </Link>
                    </CardActions>
                </Card>
                </Grid>
            </Grid>
            </Container>
        </>
    );
};

export default SurveyHomePage;

// import React from 'react';
// import { Container, Typography, Box, Button, Stack } from '@mui/material';
// import Link from 'next/link';

// const SurveyHomePage: React.FC = () => {
//     return (
//         <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
//         <Typography variant="h4" gutterBottom>
//             アンケートサイト
//         </Typography>

//         <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
//             ここではアンケートの作成や回答ができます。
//         </Typography>

//         <Stack spacing={2} direction="column" alignItems="center">
//             <Link href="/survey/create" passHref>
//             <Button variant="contained" size="large">
//                 アンケートを作成する
//             </Button>
//             </Link>

//             <Link href="/survey/list" passHref>
//             <Button variant="outlined" size="large" color="primary">
//                 アンケートに回答する
//             </Button>
//             </Link>
//         </Stack>
//         </Container>
//     );
// };

// export default SurveyHomePage;
