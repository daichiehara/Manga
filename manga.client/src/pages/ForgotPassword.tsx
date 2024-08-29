import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Alert 
} from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import CustomTocaeruToolbar from '../components/common/CustomTocaeruToolBar';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';

const FormStyled = styled('form')(({ theme }) => ({
  width: '100%', // IE 11の問題を修正
  marginTop: theme.spacing(1),
}));

const SubmitButtonStyled = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://localhost:7103/api/Users/ForgotPassword', { email }, { withCredentials: true });
      setMessage(response.data.message);
      setError('');
      navigate('/login-page');
    } catch (err) {
      setError('パスワードリセットメールの送信に失敗しました。再度お試しください。');
      setMessage('');
    }
  };

  const description = `[トカエル]このページでは、パスワードを忘れたユーザーが、パスワードをリセットするための案内をメールで受け取ることができます。`;

  return (
    <HelmetProvider>
      <Helmet>
        <title>パスワードリセット - {SERVICE_NAME}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content="パスワードリセット" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="パスワードリセット" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
      </Helmet>
      <CustomTocaeruToolbar showSubtitle subtitle={'パスワードを忘れた方'} />
      <Box sx={{ px: `1.2rem`, pt: '1rem', pb: '1rem' }}>
        <Typography component="h1" variant="subtitle2">
          ご登録されたメールアドレスにパスワード再設定のご案内が送信されます。
        </Typography>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <FormStyled onSubmit={handleSubmit}>
          <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>
            メールアドレス
          </Typography>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="email"
            placeholder="tocaeru@email.com"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <SubmitButtonStyled
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            パスワードをリセットする
          </SubmitButtonStyled>
        </FormStyled>
        <Typography variant='body2' sx={{ color: theme.palette.text.secondary }}>
          このサイトはreCAPTCHAで保護されており、Googleのプライバシーポリシーと利用規約が適用されます。
        </Typography>
      </Box>
    </HelmetProvider>
  );
};

export default ForgotPassword;
