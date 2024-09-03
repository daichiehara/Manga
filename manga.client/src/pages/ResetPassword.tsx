import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/system';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import CustomTocaeruToolbar from '../components/common/CustomTocaeruToolBar';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';
import { API_BASE_URL } from '../apiName';

// スタイルの定義
const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const FormStyled = styled('form')(({ theme }) => ({
  width: '100%', // IE 11の問題を修正
  marginTop: theme.spacing(1),
}));

const SubmitButtonStyled = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const validatePassword = (password: string) => {
  if (/[！-～]/.test(password)) {
    return '全角文字を含めないでください';
  }
  if (password.length < 8) {
    return 'パスワードは8文字以上にしてください';
  }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'パスワードは小文字、大文字、数字を含めてください';
  }
  return null;
};

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    console.log(token);
    console.log(userId);

    if (!token || !userId) {
      setError('無効なパスワードリセットリンクです。');
      return;
    }

    const validationMessage = validatePassword(password);
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    } else {
      setValidationError('');
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/Users/ResetPassword`, { userId, token, newPassword: password, confirmPassword: confirmPassword }, { withCredentials: true });
      setMessage(response.data.message);
      setError('');
      navigate('/login-page'); // リセット成功後にログインページにリダイレクト
    } catch (err) {
      setError('パスワードのリセットに失敗しました。再度お試しください。');
      setMessage('');
    }
  };

  const description = `${SERVICE_NAME}パスワードリセットページです。新しいパスワードを設定してください。`;


  return (
    <HelmetProvider>
      <Helmet>
        <title>{SERVICE_NAME} - パスワードリセット</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${SERVICE_NAME} - パスワードリセット`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${SERVICE_NAME} - パスワードリセット`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
      </Helmet>
      <CustomTocaeruToolbar showBackButton={false} showSubtitle subtitle={'パスワードをリセットする'} />
      <Box sx={{ px: `1.2rem`, pt: '1rem', pb: '1rem' }}>
        <Typography component="h1" variant="subtitle2">
          新しいパスワードを入力してください。
        </Typography>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        {validationError && <Alert severity="error">{validationError}</Alert>}
        <FormStyled onSubmit={handleSubmit}>
          <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>
            パスワード
          </Typography>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Typography component="h1" variant="subtitle2" sx={{ py: '1rem' }}>
            確認のため上記と同じパスワードを入力してください。
          </Typography>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="confirmPassword"
            type="password"
            id="confirmPassword"
            autoComplete="current-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <SubmitButtonStyled
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            リセットする
          </SubmitButtonStyled>
        </FormStyled>
      </Box>
    </HelmetProvider>
  );
};

export default ResetPassword;
