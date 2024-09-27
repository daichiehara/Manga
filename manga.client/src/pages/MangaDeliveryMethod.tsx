import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  Email, 
  LocationOn, 
  LocalShipping, 
  Notifications,
  Warning,
  CheckCircleOutline,
  ExpandMore,
  ArrowDownward as ArrowDownwardIcon, // 矢印アイコンを変更
  AutoAwesome,
  MoveToInbox
} from '@mui/icons-material';
import CustomToolbar from '../components/common/CustumToolbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#f9f9f9',
    },
  },
  typography: {
    h3: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  spacing: 8,
});

const StepsSection: React.FC = () => {
  const steps = [
    {
      icon: <AutoAwesome sx={{color:`red`}}/>,
      title: "交換成立",
      description: "本人もしくは相手が交換申請を受け入れたら成立です。",
    },
    {
      icon: <Email color="primary" />,
      title: "メールが届きます",
      description: "交換成立の通知がメールで届きます。",
    },
    {
      icon: <LocationOn sx={{color:`green`}} />,
      title: "相手の住所を確認",
      description: "相手のの配達先住所を確認します。個人情報ですので慎重に扱ってください。",
    },
    {
      icon: <MoveToInbox color="primary" />,
      title: "発送の準備",
      description: "設定した発送期限までに発送の準備をしてください。梱包方法の詳しい手順は以下「発送手続き」をご確認ください。",
    },
    {
      icon: <LocalShipping sx={{color:`orange`}} />,
      title: "発送手続き",
      description: "発送は前払い（送料を支払う必要があります）。着払いは許可されていないので注意してください。近くの宅配業者（例：ヤマトの営業所、コンビニエンスストア等）から送付できます。",
    },
    {
      icon: <CheckCircleOutline color="primary" />,
      title: "取引完了",
      description: "その後、漫画を受け取ったら取引完了です。",
    },
  ];

  return (
    <Card variant="outlined" sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          手順
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          {steps.map((step, index) => (
            <Box key={index} display="flex" flexDirection="column" width="100%">
              <Box display="flex" alignItems="center">
                {step.icon}
                <Box ml={2}>
                  <Typography variant="h6">{step.title}</Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {step.description}
              </Typography>
              {index < steps.length - 1 && (
                <ArrowDownwardIcon 
                  sx={{ 
                    mt: 2, 
                    mb: 2, 
                    fontSize: 20, 
                    color: 'primary.main', 
                    alignSelf: 'center' 
                  }} 
                />
              )}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const ShippingProcedure: React.FC = () => (
  <Card variant="outlined" sx={{ mb: 4 }}>
    <CardContent>
      <Typography variant="h5" component="h2" gutterBottom>
        発送手続き
      </Typography>
      <Typography variant="h6" gutterBottom>
        梱包
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutline color="primary" />
          </ListItemIcon>
          <ListItemText primary="雨や水滴から守るために、漫画をビニール袋に入れます。" />
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutline color="primary" />
          </ListItemIcon>
          <ListItemText primary="クッション材で包み、適切なサイズのダンボールに梱包します。" />
        </ListItem>
      </List>
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        発送手続き
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutline color="primary" />
          </ListItemIcon>
          <ListItemText primary="漫画を最寄りの宅配業者（または発送を扱うコンビニ）に持って行きます。" />
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutline color="primary" />
          </ListItemIcon>
          <ListItemText primary="受取人の住所を記入し、前払いの発送を選択します。" />
        </ListItem>
      </List>
    </CardContent>
  </Card>
);

const ShippingCostTable: React.FC = () => (
  <TableContainer component={Paper} sx={{ mb: 4 }}>
    <Box sx={{ p: 2 }}>
      <Typography variant="body2" color="textSecondary">
        特定の宅配業者は指定されていません。ここでは、参考としてヤマト宅急便を利用し、関東から関西へ発送する場合の送料を掲載しています。
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        送料は、パッケージの総寸法（高さ + 幅 + 奥行き）と実際の重量を比較して、より大きい値を基に決定されます。詳しくは、<Link href="https://www.kuronekoyamato.co.jp/ytc/search/payment/simulation.html" target="_blank" rel="noopener" sx={{ textDecoration: 'none' }}>ヤマト運輸 公式ウェブサイト</Link>をご覧ください。
      </Typography>
    </Box>
    <Table aria-label="送料テーブル">
      <TableHead>
        <TableRow>
          <TableCell>サイズ</TableCell>
          <TableCell align="right">重量制限</TableCell>
          <TableCell align="right">価格（円）</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[
          { size: '60サイズ', weight: '2kgまで', price: '¥1,060' },
          { size: '80サイズ', weight: '5kgまで', price: '¥1,350' },
          { size: '100サイズ', weight: '10kgまで', price: '¥1,650' },
          { size: '120サイズ', weight: '15kgまで', price: '¥1,970' },
          { size: '140サイズ', weight: '20kgまで', price: '¥2,310' },
          { size: '160サイズ', weight: '25kgまで', price: '¥2,630' },
          { size: '180サイズ', weight: '30kgまで', price: '¥3,730' },
          { size: '200サイズ', weight: '30kgまで', price: '¥4,500' },
        ].map((row) => (
          <TableRow key={row.size}>
            <TableCell component="th" scope="row">
              {row.size}
            </TableCell>
            <TableCell align="right">{row.weight}</TableCell>
            <TableCell align="right">{row.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const ImportantNotes: React.FC = () => (
  <Card variant="outlined" sx={{ mb: 4 }}>
    <CardContent>
      <Typography variant="h5" component="h2" gutterBottom>
        注意事項
      </Typography>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="note1-content"
          id="note1-header"
        >
          <Typography color="error">着払いはご利用いただけません。</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            送料は必ず前払いであることを確認してください。
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="note2-content"
          id="note2-header"
        >
          <Typography color="error">丁寧な梱包をお願いします。</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            漫画を雨や水滴から守るため、ビニール袋に入れてから梱包してください。
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="note3-content"
          id="note3-header"
        >
          <Typography color="error">受取人の住所は正確に入力してください。</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            配達ミスを防ぐため、受取人の住所を正確に入力してください。
          </Typography>
        </AccordionDetails>
      </Accordion>
    </CardContent>
  </Card>

);

export default function MangaDeliveryMethodPage() {

  const description = "漫画の配送方法についての詳細です。"; // 説明をここに設定

  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <title>{SERVICE_NAME}に出品する - {SERVICE_NAME}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${SERVICE_NAME}に出品する - ${SERVICE_NAME}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:title" content={`${SERVICE_NAME}に出品する - ${SERVICE_NAME}`} />
        <meta name="twitter:description" content={description} />
      </Helmet>
      <CustomToolbar title='配送方法' />
      <Container maxWidth="lg" sx={{ backgroundColor: 'background.default', py: 5 }}>
        <Box mt={4} mb={2}>
              <img 
              src='/public/PackingDescription.webp'
              alt="アプリの使い方の説明画像" 
              style={{ width: '100%', borderRadius: '10px' }} 
              />
          </Box>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <StepsSection />
          </Grid>
          <Grid item xs={12}>
            <ShippingProcedure />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" gutterBottom>
              送料の目安
            </Typography>
            <ShippingCostTable />
          </Grid>
          <Grid item xs={12}>
            <ImportantNotes />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
