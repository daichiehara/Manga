import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

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
  const { register, handleSubmit } = useForm<LoginFormInputs>();

  const onSubmit = (data: LoginFormInputs) => {
    setApiErrors({}); // Clear previous errors

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
      });
  };

  return (
    <Box sx={{p:3, boxShadow:"none", border:'none'}}>
      <Typography variant="h5">ログイン</Typography>
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
        <Typography 
            variant="subtitle2">

                {apiErrors.message}</Typography>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{my:1, background: 'linear-gradient(to right, #FCCF31, #F55555)'}}>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;
