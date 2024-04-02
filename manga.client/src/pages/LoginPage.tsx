import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 前のページに戻る
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Placeholder for authentication logic
    console.log('Login credentials', { email, password });
    // Replace above line with actual API call
  };

  return (
    <div>
        <BackButton handleBack={handleBack} />
      <Container maxWidth="sm" sx={{mt:3, display:'flex', justifyContent:'center', alignItems:'center'}}>
        <Typography variant="h5" component="h1" sx={{fontWeight:600}} >
          ログイン
        </Typography>
      </Container>
      
      <Container maxWidth="sm" sx={{mb:1, display:'flex', justifyContent:'right', alignItems:'center'}}>
      <Typography variant="body2" align="center" sx={{ }}>
            <Link href="/signup" underline="hover" sx={{color:'#5CA2F8'}}>
            会員登録はこちら
            </Link>
          </Typography>
        </Container>

      <Container maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="メールアドレス"
            margin="normal"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            sx={{py:1}}
          />
          <TextField
            fullWidth
            label="パスワード"
            type="password"
            margin="normal"
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt:3 }}
          >
            ログイン
          </Button>
        </form>
      </Container>
      <Container maxWidth="sm" sx={{pt:3, mb:1, display:'flex', justifyContent:'right', alignItems:'center'}}>
        <Typography variant="body2" align="center" sx={{ }}>
            <Link href="/forgetpassword" underline="hover" sx={{color:'#5CA2F8'}}>
            パスワードを忘れた方はこちら
            </Link>
        </Typography>
        </Container>
        <Container maxWidth="sm" sx={{mb:1, display:'flex', justifyContent:'right', alignItems:'center'}}>
            <Typography variant="body2" align="center" sx={{ }}>
                <Link href="/notlogin" underline="hover" sx={{color:'#5CA2F8'}}>
                ログインできない方はこちら
                </Link>
            </Typography>
        </Container>
    </div>
  );
};

export default LoginForm;