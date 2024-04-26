import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Button, Avatar, Box, Stack, Grid, Snackbar, Alert } from '@mui/material';
import MenuBar from '../components/menu/MenuBar';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { Link } from 'react-router-dom';
import LogoutList from '../components/mypage/LogoutList';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';


interface MainMyPage {
  title: string; 
  nickName: string;
  profileIcon : string;
  hasIdVerificationImage: boolean;

}

const MainMyPage: React.FC = () => {
  const [myPage, setMyPage] = useState<MainMyPage | null>(null);
  const { authState } = useContext(AuthContext);

  const navigate = useNavigate();

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const location = useLocation();
  useEffect(() => {
    if (location.state?.snackOpen) {
      setSnackMessage(location.state.snackMessage);
      setSnackOpen(true);
    }
  }, [location]);

  // useCallbackを使用して関数が再生成されるのを避ける
  const handleLogin = useCallback(() => {
    navigate('/login-page');
  }, [navigate]);

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
    
    // ログインしている場合に実行するAPIコールなど
    const fetchMyPage = async () => {
      try {
        const response = await axios.get('https://localhost:7103/api/Users/MyPage', {
          withCredentials: true
        });
        setMyPage(response.data);
      } catch (error) {
        console.error('ユーザー情報の取得に失敗しました。', error);
      }
    };

    fetchMyPage();
  }, [authState.isAuthenticated]);

  

  return (
    <>
      <CustomToolbar title='マイページ'/>
      {/* ログイン状態に応じて表示を切り替える */}
      {authState.isAuthenticated ? (
        // ログインしている場合の表示
        myPage ? (
          // myPageデータがある場合の表示
          <Box px={{}}>
          <Grid container direction="column" display="flex" alignItems="center" justifyContent="center" spacing={2} sx={{pt:15, pb:8}}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 1.8,}}>
                <Avatar src={myPage.profileIcon} alt={myPage.nickName} sx={{width:`4rem`, height:`4rem`}}/>        
              </Stack>
            </Box>

            <Box>
                <Grid container direction="column" alignItems="center" >
                    
                    <Typography variant="subtitle1" sx={{pb:1, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                        {myPage.nickName}
                    </Typography>
                    {myPage.hasIdVerificationImage ? (
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
        <Grid item xs={4}display="flex" alignItems="center" justifyContent="center"flexDirection="column" component={Link} to={'/mpfavolist' } sx={{textDecoration: 'none'}}>
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
        <Grid item xs={4}display="flex" alignItems="center" justifyContent="center"flexDirection="column" component={Link} to={'/mpmysell' }sx={{textDecoration: 'none'}}>
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
        <Grid item xs={4} display="flex" alignItems="center" justifyContent="center"flexDirection="column" component={Link} to={'/mpmatchedsell' }sx={{textDecoration: 'none'}}>
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',  // 画面全体の高さを使用
          }}
        >

          <Typography variant='h6' sx={{mb:`2rem`,fontWeight:`bold`,color:'#707070'}}>
            ご利用にはログイン・会員登録が必要です
          </Typography>
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'linear-gradient(to right, #FCCF31, #F55555)',
              color: '#FFFFFF',
              width:`95%`,
              
              borderRadius: '8px',
              boxShadow: 'none',
              '&:hover': {
                background: 'linear-gradient(to right, #FDB813, #F55555)',
                boxShadow: 'none',
              }
            }}
          >
            ログイン・会員登録
          </Button>
        </Box>
        

      )}

      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        style={{ marginBottom: '5rem' }}
      >
      <Alert severity="success">{snackMessage}</Alert>
      </Snackbar>
      
      {/* 以降の部分は変わらず共通のコンポーネントやUI要素を表示 */}
      <MenuBar />

    </>
  );
};

export default MainMyPage;
