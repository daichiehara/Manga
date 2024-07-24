import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import BackButton from '../components/common/BackButton';
import { updateGlobalAuthState } from '../components/context/AuthContext';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


type LoginFormInputs = {
  email: string;
  password: string;
};

type ApiErrors = {
    email?: string;
    password?: string;
    message?: string; // Add this line
  };

const Login: React.FC = () => {
  const [apiErrors, setApiErrors] = useState<ApiErrors>({}); 
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginFormInputs>();

  const handleBack = () => {
    navigate(-1); // 前のページに戻る
  };
 
  const onSubmit = (data: LoginFormInputs) => {
    setApiErrors({}); // Clear previous errors
    setIsLoading(true); 

    axios.post('https://localhost:7103/api/Users/Login', {
      Email: data.email,
      Password: data.password
    },{
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
    .then(response => {
    setIsLoginSuccessful(true);
    updateGlobalAuthState({ isAuthenticated: true }); 
    navigate(-1);
    })
    .catch(error => {
        setIsLoginSuccessful(false);
        if (error.response && error.response.data) {
          let newErrors: ApiErrors = {};
      
          // Handle field-specific errors
          const fieldErrors = error.response.data.errors;
          if (fieldErrors) {
            if (fieldErrors.Email) {
              newErrors.email = fieldErrors.Email[0];
            }
            if (fieldErrors.Password) {
              newErrors.password = fieldErrors.Password[0];
            }
          }
      
          // Handle general message error
          const messageError = error.response.data.messageerrors;
          if (messageError && messageError.Message) {
            newErrors.message = messageError.Message[0];
          }
      
          console.log('API Errors:', newErrors);
          setApiErrors(newErrors);
        }
      })
    
    .finally(() => {
        setIsLoading(false); 
    });
      
  };

  const handleNavigateRegisterPage = () => {
    navigate('/login-page/Register');
  }


  return (
    <Box sx={{pt:`4rem`, p:`1.2rem`, boxShadow:"none", border:'none'}}>
        <BackButton handleBack={handleBack} />
      <Typography variant="h5"sx={{ textAlign: 'center', fontWeight:'550' }}>ログイン</Typography>
      {isLoginSuccessful && <Alert severity="success">Login successful!</Alert>}
      {apiErrors.message && <Alert severity="error">{apiErrors.message}</Alert>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="メールアドレス"
          variant="outlined"
          margin="normal"
          fullWidth
          {...register('email')}
          error={!!apiErrors.email}
          helperText={apiErrors.email}
        />
        <TextField
          label="パスワード"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          {...register('password')}
          error={!!apiErrors.password}
          helperText={apiErrors.password}

        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{my:1, background: 'linear-gradient(to right, #FCCF31, #F55555)'}} disabled={isLoading}>
        {isLoading ? <CircularProgress size={24} sx={{color:'white'}}/> : 'Login'}
        </Button>
      </form>
      <Button onClick={handleNavigateRegisterPage}>
        会員登録
      </Button>
      
    </Box>
  );
};

export default Login;
