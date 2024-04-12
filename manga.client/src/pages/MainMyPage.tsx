import React, { useState } from 'react';
import { Typography, Button, Avatar, Tab, Tabs, Box, Toolbar, Grid } from '@mui/material';
import MenuBar from '../components/menu/MenuBar';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import CustomToolbar from '../components/common/CustumToolbar';
import LoopIcon from '@mui/icons-material/Loop';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MenuBookIcon from '@mui/icons-material/MenuBook';

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
  const handleMpFavoList = () => {
   
    navigate('/mpfavolist'); // ここにリダイレクト先のパスを指定
  };


  return (
    <>
      <CustomToolbar title='マイページ'/>
      <Box display="flex" alignItems="center" justifyContent="center"sx={{pt:13,pb:9, px:1.5}}>
        <Box display="flex" alignItems="center"justifyContent="center">
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

      <Grid container display="flex" alignItems="center" justifyContent="center" sx={{px:2,borderBottom: '0.5px solid #D9D9D9' }}>
        <Grid item xs={4}display="flex" alignItems="center" justifyContent="center"flexDirection="column">
          <Box
            bgcolor="grey.300" // グレーの背景色
            borderRadius="50%" // 円形にする
            p={1} // パディング
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FavoriteBorderIcon sx={{fontSize:`2.5rem`, color:`#7F7F7F`}}/> {/* アイコン */}
          </Box>
          <Typography variant="body2" gutterBottom sx={{pt:2, pb:1, fontWeight:'bold', color: '#757575'}}>
            {`いいね一覧`}
          </Typography>
        </Grid>
        <Grid item xs={4}display="flex" alignItems="center" justifyContent="center"flexDirection="column">
          <Box
            bgcolor="#F2F2F2" // グレーの背景色
            borderRadius="50%" // 円形にする
            p={1} // パディング
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <MenuBookIcon sx={{fontSize:`2.5rem`, color:`#7F7F7F`}}/> {/* アイコン */}
          </Box>
          <Typography variant="body2" gutterBottom sx={{pt:2, pb:1, fontWeight:'bold', color: '#757575'}}>
            {`出品した漫画`}
          </Typography>
        </Grid>
        <Grid item xs={4}display="flex" alignItems="center" justifyContent="center"flexDirection="column">
          <Box
            bgcolor="grey.300" // グレーの背景色
            borderRadius="50%" // 円形にする
            p={1} // パディング
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <LoopIcon sx={{fontSize:`2.5rem`, color:`#7F7F7F`}}/> {/* アイコン */}
          </Box>
          <Typography variant="body2" gutterBottom sx={{pt:2, pb:1, fontWeight:'bold', color: '#757575'}}>
            {`交換した漫画`}
          </Typography>
        </Grid>
      </Grid>

      <Box display="flex" alignItems="center" justifyContent="center" sx={{ width:`100%`}}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="user profile tabs" sx={{ width:`100%`}}>
          <Tab label="いいね！一覧" />
          <Tab label="出品した漫画" />
          <Tab label="交換した漫画" />
        </Tabs>
        </Box>
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
      <Button variant="contained" onClick={handleMpFavoList} sx={{ mt:5 }}>
            いいねリスト
          </Button>
    </>
  );
};

export default MainMyPage;
