import React, { useState } from 'react';
import { Box, Button, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.get('https://localhost:7103/api/Users/signin-google', {
        headers: {
          Authorization: `Bearer ${credentialResponse.credential}`,
        },
        withCredentials: true, // ここでwithCredentialsを追加
      });

      setSuccess('Googleアカウントでのサインインが成功しました。');
      setLoading(false);

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setError('Google認証に失敗しました。');
      setLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    setError('Google認証に失敗しました。');
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
          <img
            src="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp"
            alt="Tocaeru Logo"
            style={{ width: '200px', marginBottom: '16px' }} // ロゴのサイズとマージンを調整
          />
          <Typography component="h1" variant="h5">
            サインイン
          </Typography>
          <Box sx={{ mt: 3 }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
              />
            )}
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => navigate('/login-page/signup/Email')}
          >
            メールで登録
          </Button>
        </Box>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default SignupPage;
