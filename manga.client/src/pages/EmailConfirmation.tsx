import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box, ThemeProvider, createTheme } from '@mui/material';
import { styled } from '@mui/system';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CustomToolbar from '../components/common/CustumToolbar';
import MenuBar from '../components/menu/MenuBar';
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
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 16,
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  fontSize: 64,
  marginBottom: theme.spacing(2),
}));

const EmailConfirmation: React.FC = () => {
  const [status, setStatus] = useState<'success' | 'error'>('error');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('status');
    const message = searchParams.get('message');

    if (status === 'success') {
      setStatus('success');
      setMessage('すべてのサービスがご利用いただけます。');
    } else {
      setStatus('error');
      setMessage(message || '期限切れのリンクの可能性があります。');
    }
  }, [location]);

  const handleNavigateHome = () => {
    navigate('/');
  };

  const description = `[トカエル]このページでは、メールアドレスの確認状況を表示しています。登録が完了したかどうかを確認してください。`;

  return (
    <>
      <Helmet>
      <title>メールアドレスの確認 - {SERVICE_NAME}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content="メールアドレスの確認" />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={window.location.href} />
      <meta name="twitter:title" content="メールアドレスの確認" />
      <meta name="twitter:description" content={description} />
    </Helmet>
      <ThemeProvider theme={theme}>
        <CustomToolbar title='メールアドレスの確認'/>
        <Container maxWidth="sm" sx={{ pt: 10, mb: 4 }}>
          <StyledPaper elevation={3}>
            <IconWrapper>
              {status === 'success' ? (
                <CheckCircleOutlineIcon color="primary" fontSize="inherit" />
              ) : (
                <ErrorOutlineIcon color="error" fontSize="inherit" />
              )}
            </IconWrapper>
            {status === 'success' ? (
              <>
                <Typography variant="h4" gutterBottom color="primary" textAlign={'center'}>
                  アカウントの登録が完了しました。
                </Typography>
                <Typography variant="body1" paragraph align="center" textAlign={'center'}>
                  {message}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleNavigateHome}
                  size="large"
                  sx={{ mt: 2, borderRadius: 28 }}
                >
                  出品一覧へ
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h4" gutterBottom color="error">
                  メールアドレスの確認中にエラーが起こりました。
                </Typography>
                <Typography variant="body1" paragraph align="center">
                  {message}
                </Typography>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  href="/contact"
                  size="large"
                  sx={{ mt: 2, borderRadius: 28 }}
                >
                  リトライ
                </Button>
              </>
            )}
          </StyledPaper>
        </Container>
        <MenuBar />
      </ThemeProvider>
    </>
  );
};

export default EmailConfirmation;