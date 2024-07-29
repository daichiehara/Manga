import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Alert, ButtonBase } from '@mui/material';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomTocaeruToolbar from '../components/common/CustomTocaeruToolBar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';

const SignupPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
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
    <GoogleOAuthProvider clientId="1013291515281-j5re58a4bjt9qk9dgp6sdoquick9mv8j.apps.googleusercontent.com">
      <CustomTocaeruToolbar />
      
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width:'100%' }}>
          <Typography component="h1" variant="h5">
            会員登録
          </Typography>
          <Box sx={{ mt: '5rem' }}>
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
          <ButtonBase
      onClick={() => navigate('/login-page/signup/Email')}
      sx={{
        width:buttonWidth,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'primary.main',
        color: 'white',
        mt:'1rem',
        pl:'10px',
        pr:'20px',
        py:'8px',
        borderRadius: 1,
        '&:hover': {
          bgcolor: 'primary.dark',
        },
      }}
    >
      <MailOutlineOutlinedIcon sx={{ marginRight: 'auto',}} />
      <Typography variant='subtitle2' sx={{ flexGrow: 1, textAlign: 'center',  }}>
        メールで登録
      </Typography>
    </ButtonBase>
        </Box>
   
    </GoogleOAuthProvider>
  );
};

export default SignupPage;
