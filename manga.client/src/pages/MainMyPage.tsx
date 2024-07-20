import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Button, Avatar, Box, Stack, Grid, Snackbar, Alert } from '@mui/material';
import MenuBar from '../components/menu/MenuBar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../api/authService';
import BeenhereRoundedIcon from '@mui/icons-material/BeenhereRounded';
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined'; 
import CustomToolbar from '../components/common/CustumToolbar';
import LoopIcon from '@mui/icons-material/Loop';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import axios from 'axios';
import SettingList from '../components/mypage/SettingList';
import SellSettingList from '../components/mypage/SellSettingList';
import PolicyList from '../components/mypage/PolicyList';
import { useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';
import { UserContext } from '../components/context/UserContext';
import LogoutList from '../components/mypage/LogoutList';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useSnackbar } from '../hooks/useSnackbar';
import { LEFT } from 'react-swipeable';
import NavigateToLoginBox from '../components/login/NavigateToLoginBox';

interface MainMyPage {
  title: string; 
  nickName: string;
  profileIcon : string;
  hasIdVerificationImage: boolean;

}

const MainMyPage: React.FC = () => {
  const { userInfo } = useContext(UserContext);
  const { authState } = useContext(AuthContext);

  const navigate = useNavigate();

  const location = useLocation();
  useSnackbar();

  const handleLogout = useCallback(() => {
    authService.logout()
      .then(() => {
        navigate('/');
      })
      .catch(error => {
        console.error('ログアウトエラー', error);
      });
  }, [navigate]);

  const handleMpFavoList = useCallback(() => {
    navigate('/mpfavolist');
  }, [navigate]);

  // useEffectでのAPIコールは、コンポーネントがマウントされた時のみに行われる
  useEffect(() => {
    if (!authState.isAuthenticated) {
      // ログインしていない場合は何もしない（あるいは、ここでログインページにリダイレクトさせるなど）
      return;
    }
  }, [authState.isAuthenticated]);

  

  return (
    <>
      <CustomToolbar title='マイページ' showBackButton={false} />
      {/* ログイン状態に応じて表示を切り替える */}
      {authState.isAuthenticated ? (
        // ログインしている場合の表示
        userInfo ? (
          // myPageデータがある場合の表示
          <Box px={{}}>
          <Grid container direction="column" display="flex" alignItems="center" justifyContent="center" spacing={2} sx={{pt:15, pb:8}}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 1.8,}}>
                <Avatar src={userInfo.profileIcon} alt={userInfo.nickName} sx={{width:`4rem`, height:`4rem`}}/>        
              </Stack>
            </Box>

            <Box>
                <Grid container direction="column" alignItems="center" >
                    
                    <Typography variant="subtitle1" sx={{pb:1, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                        {userInfo.nickName}
                    </Typography>
                    {userInfo.hasIdVerificationImage ? (
                        <Grid container spacing={0.5} alignItems="center"sx={{pt:1}}>
                            <BeenhereRoundedIcon color="primary" sx={{display: 'flex', justifyContent: 'center', alignItems: `center` }} />
                            <Typography variant="body1" sx={{pl:1, color: 'black'}}>
                                {`本人確認済`}
                            </Typography>
                        </Grid>
                    ) : (
                        <Grid container spacing={0.5} alignItems="center">
                            <BeenhereOutlinedIcon color="disabled" sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem'}} />
                            <Typography variant="body1" sx={{pl:1, color: 'black'}}>
                                {`本人確認前`}
                            </Typography>
                        </Grid>
                        
                    )}
                </Grid>
            </Box>
        </Grid>
        <Grid container display="flex" alignItems="center" justifyContent="center" sx={{px:2,pb:3,}}>
        <Grid item xs={4}display="flex" alignItems="center" justifyContent="center"flexDirection="column" component={Link} to={'/mypage/favolist' } sx={{textDecoration: 'none'}}>
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
        <Grid item xs={4}display="flex" alignItems="center" justifyContent="center"flexDirection="column" component={Link} to={'/mypage/mysell' }sx={{textDecoration: 'none'}}>
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
        <Grid item xs={4} display="flex" alignItems="center" justifyContent="center"flexDirection="column" component={Link} to={'/mypage/matchedsell' }sx={{textDecoration: 'none'}}>
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
      {/* 設定など */}
      <SellSettingList />
      <SettingList />
      <PolicyList />
      <LogoutList />
      

      </Box>


        ) : (
          // myPageデータがまだない場合の表示
          <Typography variant="body1" align="center">
            データを取得中...
          </Typography>
        )
      ) : (
        // ログインしていない場合の表示
        <NavigateToLoginBox height='80vh'/>
      )}

      
      
      
      {/* 以降の部分は変わらず共通のコンポーネントやUI要素を表示 */}
      <MenuBar />
    </>
  );
};

export default MainMyPage;
