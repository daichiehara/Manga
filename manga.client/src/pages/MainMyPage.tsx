import React from 'react';
import { Typography, Button } from '@mui/material';
import MenuBar from '../components/menu/MenuBar';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';

const MainMyPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
   
    navigate('/login-page'); // ここにリダイレクト先のパスを指定
  };
  const handleLogout = () => {
    // ここでログアウト処理を行い、成功したらリダイレクト
    authService.logout()
      .then(() => {
        // ログアウト成功後の処理
        navigate('/'); // 一旦MainSearch
      })
      .catch(error => {
        // エラー処理
        console.log(`ログアウトエラー`)
      });
    
  };

  
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        マイペーじー
      </Typography>
      <Button variant="contained" onClick={handleLogin}>
      ログイン
    </Button>
    <Button variant="contained" onClick={handleLogout}>
      ログアウト
    </Button>
      <MenuBar />
    </>
  );
};

export default MainMyPage;
