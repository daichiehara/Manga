import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../components/common/AuthContext'; 

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

  const onSubmit = (data: LoginFormInputs) => {
    setApiErrors({}); // Clear previous errors
    setIsLoading(true); 

    axios.post('http://localhost:5227/api/Users/Login', {
      Email: data.email,
      Password: data.password

    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
    setIsLoginSuccessful(true);
    navigate('/test'); 
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

  return (
    <Box sx={{p:3, boxShadow:"none", border:'none'}}>
      <Typography variant="h5"sx={{}}>ログイン</Typography>
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
    </Box>
  );
};

export default Login;
