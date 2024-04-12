import React, { useState } from 'react';
import { Typography, Button, Avatar, Tab, Tabs, Box } from '@mui/material';
import MenuBar from '../components/menu/MenuBar';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import CustomToolbar from '../components/common/CustumToolbar';

interface MainMyPage {
  title: string; 
}

const MainMyPage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
      
      <Box display="flex" alignItems="center" justifyContent="space-between"sx={{pt:5, px:1.5}}>
        <Box display="flex" alignItems="center">
          <Avatar src="/path-to-user-avatar.jpg" sx={{ marginRight: 2 }} />
          <Box>
            <Typography variant="h6">ユーザー名</Typography>
            <Box display="flex" alignItems="center">
              <StarOutlineIcon color="secondary" />
              <Typography variant="body2" sx={{ marginLeft: 0.5 }}>
                (141)
              </Typography>
            </Box>
          </Box>
        </Box>
        
      </Box>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="user profile tabs" sx={{ width:`100%`}}>
        <Tab label="いいね！一覧" />
        <Tab label="出品した漫画" />
        <Tab label="交換した漫画" />
      </Tabs>
      <Box sx={{pt:10}}>
          <Button variant="contained" onClick={handleLogin}>
            ログイン
          </Button>
          <Button variant="contained" onClick={handleLogout} sx={{ marginLeft: 2 }}>
            ログアウト
          </Button>
        </Box>
      <MenuBar />
      {/* Add TabPanel components here */}
    </>
  );
};

export default MainMyPage;
