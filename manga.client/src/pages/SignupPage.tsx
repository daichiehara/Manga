import React, { useState, useContext } from 'react';
import { Box, Button, Divider, Typography, CircularProgress, Alert, ButtonBase } from '@mui/material';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomTocaeruToolbar from '../components/common/CustomTocaeruToolBar';
import { updateGlobalAuthState } from '../components/context/AuthContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import CustomLink from '../components/common/CustomLink';
import { useCustomNavigate } from '../hooks/useCustomNavigate';
import { SnackbarContext } from '../components/context/SnackbarContext';
import { Helmet } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';
import { API_BASE_URL } from '../apiName';

const SignupPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const customNavigate = useCustomNavigate();
  const { showSnackbar } = useContext(SnackbarContext);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isIse = useMediaQuery(theme.breakpoints.between('xs', 'ise'));
  const isSm = useMediaQuery(theme.breakpoints.between('ise', 'sm'));
  const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLg = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const buttonWidth = isXs ? '100%' : isIse ? '350px' : isSm ? '400px' : isMd ? '400px' : isLg ? '400px' : '400px';


  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
        const response = await axios.post(`${API_BASE_URL}/Users/auth/google`, {
            code: credentialResponse.credential
        }, {
            withCredentials: true,
        });

        setSuccess('Googleアカウントでのサインインが成功しました。');
        updateGlobalAuthState({ isAuthenticated: true });
        setLoading(false);

        customNavigate();
        const message = response.data.message;
        showSnackbar(message, 'success');

    } catch (err: any) {
      setError('Google認証に失敗しました。');
      setLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    setError('Google認証に失敗しました。');
  };
  const description = `${SERVICE_NAME}会員登録ページです。会員登録して漫画交換を楽しみましょう！`;
  

  return (
    <GoogleOAuthProvider clientId="1013291515281-j5re58a4bjt9qk9dgp6sdoquick9mv8j.apps.googleusercontent.com">
      <>
      <Helmet>
        <title>会員登録 - {SERVICE_NAME}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`会員登録 - ${SERVICE_NAME}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:title" content={`会員登録 - ${SERVICE_NAME}`} />
        <meta name="twitter:description" content={description} />
      </Helmet>
        <CustomTocaeruToolbar showSubtitle subtitle={'会員登録'} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <ButtonBase
            onClick={() => navigate('/signup/Email')}
            sx={{
              width: buttonWidth,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'inherit',
              color: theme.palette.text.secondary,
              border: `1px solid ${theme.palette.text.secondary}`, 
              mt: '1rem',
              pl: '10px',
              pr: '20px',
              py: '8px',
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'dark',
              },
            }}
          >
            <MailOutlineOutlinedIcon sx={{ marginRight: 'auto' }} />
            <Typography variant='subtitle2' sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold', color: theme.palette.text.secondary }}>
              メールアドレスで登録
            </Typography>
          </ButtonBase>

          {
          <Box sx={{ mt: '1rem' }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                text='signup_with'
                width={buttonWidth}
                size='large'
                logo_alignment='left'
                theme='filled_blue'
              />
            )}
          </Box>
          }

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
        </Box>

        <Box sx={{ pt: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Box sx={{ textAlign: 'left', maxWidth: buttonWidth }}>
          <Typography variant='body2' sx={{ color: theme.palette.text.secondary }}>
            <CustomLink href="/terms" target="_blank" rel="noopener noreferrer">
              利用規約
            </CustomLink>
            および
            <CustomLink href="/privacy" target="_blank" rel="noopener noreferrer">
              プライバシーポリシー
            </CustomLink>
            に同意の上、登録またはログインへお進みください。
          </Typography>
        </Box>
      </Box>


        

        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', textAlign: 'center' }}>
          <Box sx={{ py: '2rem', px: '1rem', width: buttonWidth }}>
            <Divider />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', textAlign: 'center' }}>
          <Typography variant='body2' sx={{ color: theme.palette.text.secondary }}>
            アカウントをお持ちの方
          </Typography>
        </Box>

        <Box sx={{  display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Button
            onClick={() => navigate('/login-page', {replace: true})}
            variant='outlined'
            sx={{ mt: '0.8rem', fontWeight: 'bold', color: 'red', borderColor: 'red', width: buttonWidth }}
          >
            ログイン
          </Button>
        </Box>
      </>
    </GoogleOAuthProvider>
  );
};

export default SignupPage;
