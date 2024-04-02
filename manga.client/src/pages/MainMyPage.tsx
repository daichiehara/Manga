import React from 'react';
import { Typography, Button } from '@mui/material';
import MenuBar from '../components/menu/MenuBar';
import { useNavigate } from 'react-router-dom';

const MainMyPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // ここでログイン処理を行い、成功したらリダイレクト
    // 例: navigate('/dashboard');
    navigate('/login-page'); // ここにリダイレクト先のパスを指定
  };

  
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        マイペーじー
      </Typography>
      <Button variant="contained" onClick={handleLogin}>
      ログイン
    </Button>
      <MenuBar />
    </>
  );
};

export default MainMyPage;
