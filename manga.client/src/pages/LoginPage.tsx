import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

type LoginFormInputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const [apiErrors, setApiErrors] = useState<{ email?: string, password?: string }>({});
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
      if (error.response && error.response.data && error.response.data.errors) {
        let newErrors = {};
        if (error.response.data.errors.Email) {
          newErrors = { ...newErrors, email: error.response.data.errors.Email[0] };
        }
        if (error.response.data.errors.Password) {
          newErrors = { ...newErrors, password: error.response.data.errors.Password[0] };
        }
        setApiErrors(newErrors);
      }
    });
  };

  return (
    <Box sx={{p:3, boxShadow:"none", border:'none'}}>
      <Typography variant="h5">Login</Typography>
      {isLoginSuccessful && <Alert severity="success">Login successful!</Alert>}
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
       

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{my:1, background: 'linear-gradient(to right, #FCCF31, #F55555)'}}>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;
