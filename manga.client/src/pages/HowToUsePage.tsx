import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  ThemeProvider,
  createTheme,
  Paper,
  Divider,
} from '@mui/material';
import {
  ExpandMore,
  Search,
  SwapHoriz,
  LibraryBooks,
  MoveToInbox,
  AutoAwesome,
  LocationOn,
  LocalShipping,
  CheckCircle,
} from '@mui/icons-material';
import CustomToolbar from '../components/common/CustumToolbar';
import { Helmet } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6f61', // Changed to a vibrant coral color
    },
    secondary: {
      main: '#6b5b95', // Added a secondary color
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    h3: {
      fontWeight: 700,
      fontSize: '2.2rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.6rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    body1: {
      lineHeight: 1.75,
    },
  },
});

const HowToUsePage: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <title>アプリの使い方 - {SERVICE_NAME}</title>
        <meta name="description" content="このアプリの使い方を説明します。" />
      </Helmet>
        <CustomToolbar title='アプリの使い方'/>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Box mb={4} textAlign="center">
            
            <Box mt={4}>
                <img 
                src='/images/AppDescription.webp'
                alt="アプリの使い方の説明画像" 
                style={{ width: '100%', borderRadius: '10px' }} 
                />
            </Box>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom color="secondary">
                手順
              </Typography>
              <Divider sx={{ mb: 3 }} />
              {/** Steps Accordion */}
              {stepsData.map((step, index) => (
                <Accordion
                  key={index}
                  defaultExpanded={index === 0}
                  sx={{
                    mb: 2,
                    '&:before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      backgroundColor: '#f5f5f5',
                      borderRadius: '4px',
                      '&:hover': {
                        backgroundColor: '#e0e0e0',
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                      {step.icon}
                      {step.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {step.content.map((paragraph, idx) => (
                      <Typography key={idx} paragraph>
                        {paragraph}
                      </Typography>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

// Data for the steps to keep the component clean
const stepsData = [
  {
    title: '1. 欲しい漫画を探そう！',
    icon: <Search sx={{ color: 'primary.main', mr: 1 }} />,
    content: [
      'ホーム画面から、欲しい漫画を簡単に探すことができます。作品名やジャンルで検索し、詳細ページで内容を確認しましょう。また、持っている漫画からも検索できます。',
    ],
  },
  {
    title: '2. マイ本棚機能',
    icon: <LibraryBooks sx={{ color: 'primary.main', mr: 1 }} />,
    content: [
      '「とりあえず登録」: あなたが持っている漫画を登録しておくことで、他のユーザーが検索した際に表示されやすくなります。',
      '「欲しい漫画」: 欲しい漫画をリストに追加すると、出品した商品と一緒に表示され、交換のチャンスが高まります。',
    ],
  },
  {
    title: '3. 交換リクエストをしよう！',
    icon: <SwapHoriz sx={{ color: 'primary.main', mr: 1 }} />,
    content: [
      '欲しい漫画が見つかったら、交換リクエストを送信しましょう。リクエストが承認されると次のステップに進みます。',
    ],
  },
  {
    title: '4. 自分の漫画を出品・選択しよう',
    icon: <MoveToInbox sx={{ color: 'primary.main', mr: 1 }} />,
    content: [
      '交換リクエストを送信する際、あなたが出品している漫画から交換するものを選びます。まだ出品していない場合は、新たに出品してください。複数の漫画を選択することも可能です。ただし、リクエストが成立するとキャンセルはできません。',
    ],
  },
  {
    title: '5. 交換成立',
    icon: <AutoAwesome sx={{ color: '#ffd700', mr: 1 }} />,
    content: [
      '交換リクエストが成立すると、相手の配送先住所が記載されたメールが届きます。個人情報なので慎重に取り扱ってください。',
    ],
  },
  {
    title: '6. 配送情報の確認',
    icon: <LocationOn sx={{ color: 'green', mr: 1 }} />,
    content: [
      'メールに記載された住所を確認し、発送の準備を行います。住所が正しいか再度確認して、配送ミスを防ぎましょう。',
    ],
  },
  {
    title: '7. 発送の準備',
    icon: <LocalShipping sx={{ color: 'orange', mr: 1 }} />,
    content: [
      'マンガをビニール袋に入れて防水し、クッション材で包んで丁寧に梱包します。発送手続きの詳細は「発送手続き」をご覧ください。',
    ],
  },
  {
    title: '8. 取引完了',
    icon: <CheckCircle sx={{ color: 'primary.main', mr: 1 }} />,
    content: [
      '相手が商品を受け取ったら取引完了です。お互いに評価を行い、今後の改善に役立てましょう。',
    ],
  },
];

export default HowToUsePage;
