import React, { useState } from 'react';
import { TextField, Container, Typography, Link, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import axios from 'axios';
import LoginButton from '../components/login/LoginButtun';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  };

  const handleBack = () => {
    navigate(-1); // 前のページに戻る
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    if (!isValidEmail(email) || password.length === 0) {
      setErrorMessage('正しいメールアドレスとパスワードを入力してください。');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('https://localhost:5227/api/Users/Login', {
        email,
        password
      });
      setIsLoading(false);
      // Navigate to the dashboard or home page on successful login
      navigate('/dashboard');
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        // Handle HTTP errors here
        setErrorMessage('ログインに失敗しました。再試行してください。');
      } else {
        // Handle network or other errors here
        setErrorMessage('通信エラーが発生しました。');
      }
    }
  };

  // handleSubmitButton は引数を取らず、handleSubmit を呼び出す
  const handleSubmitButton = () => {
    handleSubmit();
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
        <form onSubmit={(event) => { event.preventDefault(); handleSubmit(); }}>
          <TextField
            fullWidth
            label="メールアドレス"
            margin="normal"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            sx={{my:1}}
          />
          <TextField
            fullWidth
            label="パスワード"
            type="password"
            margin="normal"
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            sx={{my:1}}
          />
          <LoginButton 
            label="ログイン"
            onClick={handleSubmit}
            isLoading={isLoading}
        />
        </form>
        {errorMessage && (
          <Typography color="error">{errorMessage}</Typography>
        )}
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

export default LoginPage;