import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { TextField, Button, Box, Divider, Typography, Alert, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import CustomTocaeruToolbar from '../components/common/CustomTocaeruToolBar';
import { updateGlobalAuthState } from '../components/context/AuthContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import GooglePolicyText from '../components/common/GooglePolicyText';
import CustomLink from '../components/common/CustomLink';
import { useCustomNavigate } from '../hooks/useCustomNavigate';
import { SnackbarContext } from '../components/context/SnackbarContext';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Helmet } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';
import { API_BASE_URL } from '../apiName';

type LoginFormInputs = {
  email: string;
  password: string;
};

type ApiErrors = {
  email?: string;
  password?: string;
  message?: string; 
};

const Login: React.FC = () => {
  const [apiErrors, setApiErrors] = useState<ApiErrors>({});
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const customNavigate = useCustomNavigate();
  const { showSnackbar } = useContext(SnackbarContext);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: LoginFormInputs) => {
    if (!executeRecaptcha) {
      console.log('reCAPTCHA not yet available');
      return;
    }

    setApiErrors({});
    setIsLoading(true);

    try {
      const reCaptchaToken = await executeRecaptcha('login');

      const response = await axios.post(`${API_BASE_URL}/Users/Login`, {
        Email: data.email,
        Password: data.password,
        ReCaptchaToken: reCaptchaToken
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      setIsLoginSuccessful(true);
      updateGlobalAuthState({ isAuthenticated: true });
      customNavigate();
      showSnackbar('ログインしました。', 'success');
    } catch (error: any) {
      setIsLoginSuccessful(false);
      if (error.response && error.response.data) {
        let newErrors: ApiErrors = {};
        const fieldErrors = error.response.data.errors;
        if (fieldErrors) {
          if (fieldErrors.Email) {
            newErrors.email = fieldErrors.Email[0];
          }
          if (fieldErrors.Password) {
            newErrors.password = fieldErrors.Password[0];
          }
        }
        const messageError = error.response.data.messageerrors;
        if (messageError && messageError.Message) {
          newErrors.message = messageError.Message[0];
        }
        console.log('API Errors:', newErrors);
        setApiErrors(newErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // バックエンドにGoogle認証コードを送信
            const response = await axios.post(`${API_BASE_URL}/Users/auth/google`, {
                code: credentialResponse.credential
            }, {
                withCredentials: true,
            });

            setSuccess('Googleアカウントでのログインが成功しました。');
            updateGlobalAuthState({ isAuthenticated: true });
            setIsLoading(false);

            customNavigate();
            showSnackbar('ログインしました。', 'success');
        } catch (err: any) {
            setError('Google認証に失敗しました。');
            setIsLoading(false);
        }
    };

  const handleGoogleFailure = () => {
    setError('Google認証に失敗しました。');
  };

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isIse = useMediaQuery(theme.breakpoints.between('xs', 'ise'));
  const isSm = useMediaQuery(theme.breakpoints.between('ise', 'sm'));
  const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLg = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const buttonWidth = isXs ? '100%' : isIse ? '350px' : isSm ? '400px' : isMd ? '400px' : isLg ? '400px' : '400px';
  const description = `${SERVICE_NAME}ログインページです。ログインして漫画交換を楽しみましょう！`;
  return (
    
    <GoogleOAuthProvider clientId="1013291515281-j5re58a4bjt9qk9dgp6sdoquick9mv8j.apps.googleusercontent.com">
      <>
        <Helmet>
          <title>ログイン - {SERVICE_NAME}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={`ログイン - ${SERVICE_NAME}`} />
          <meta property="og:description" content={description} />
          <meta property="og:url" content={window.location.href} />
          <meta name="twitter:title" content={`ログイン - ${SERVICE_NAME}`} />
          <meta name="twitter:description" content={description} />
        </Helmet>

        <CustomTocaeruToolbar showSubtitle subtitle={'ログイン'} />
        <Box sx={{display:'flex', justifyContent:'center'}}>
          <Box sx={{ px: `1.2rem`, pt:'0.5rem', pb:0, width:buttonWidth }}>
            <Box sx={{display:'flex', justifyContent:'right'}}>
              <CustomLink onClick={() => navigate('/signup')}>
                会員登録はこちら
              </CustomLink>
            </Box>
            {isLoginSuccessful && <Alert severity="success">Login successful!</Alert>}
            {apiErrors.message && <Alert severity="error">{apiErrors.message}</Alert>}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>
                メールアドレス
              </Typography>
              <TextField
                placeholder='tocaeru@email.com'
                variant="outlined"
                fullWidth
                {...register('email')}
                error={!!apiErrors.email}
                helperText={apiErrors.email}
                sx={{ boxShadow: 'none' }}
                autoComplete="email"
              />
              <Typography variant='subtitle1' sx={{pt:'1rem', fontWeight: 'bold', color: theme.palette.text.secondary }}>
                パスワード
              </Typography>
              <TextField
                autoComplete='current-password'             
                placeholder="パスワード"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                {...register('password')}
                error={!!apiErrors.password}
                helperText={apiErrors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: '2.5rem', mb:'1rem', background: 'red', fontWeight:'bold' }} disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'ログイン'}
              </Button>
            </form>
            <Typography variant='body2' sx={{color: theme.palette.text.secondary}}>
              <CustomLink href="/terms" target="_blank" rel="noopener noreferrer">
                利用規約
              </CustomLink>および
              <CustomLink href="/privacy" target="_blank" rel="noopener noreferrer">
                プライバシーポリシー
              </CustomLink>
              に同意の上、ログインへお進みください。
            </Typography>
            
            <GooglePolicyText />
            <Box sx={{pt:'1rem', display:'flex', justifyContent:'right'}}>
              <CustomLink onClick={() => navigate('/forgot-password')} sx={{ display: 'block', color: 'skyblue', mt: 2 }}>
                パスワード忘れた方はこちら
              </CustomLink>
              
            </Box>
            {/*
            <Divider sx={{py:1, color: theme.palette.text.secondary}}>
              または
            </Divider>
            */}
          </Box>
        </Box>
        {/*
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            width={buttonWidth}
            text='signin_with'
            theme='filled_blue'
            shape='rectangular'
          />
        </Box>
        */}
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

        
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', textAlign: 'center' }}>
          <Box sx={{ py: '2rem', px: '1rem', width: buttonWidth }}>
            <Divider />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', textAlign: 'center' }}>
          <Typography variant='body2' sx={{ color: theme.palette.text.secondary }}>
            アカウントをお持ちでない方
          </Typography>
        </Box>
          <Box sx={{mt:'0.8rem',px:'1rem', display:'flex', justifyContent:'center'}} >
            <Button
            onClick={() => navigate('/signup', {replace: true})}
            variant='outlined'
            fullWidth
            sx={{fontWeight:'bold',color:'red', borderColor:'red', width:buttonWidth}}
            >
              会員登録
            </Button>
          </Box>
        </>
    </GoogleOAuthProvider>
  );
};

export default Login;
