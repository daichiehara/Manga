import React from 'react';
import { Box, Typography, Button, Grid, Divider, Stack } from '@mui/material';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import MenuBar from '../components/menu/MenuBar';
import CustomToolbar from '../components/common/CustumToolbar';
import { Link, useNavigate } from 'react-router-dom';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useSnackbar } from '../hooks/useSnackbar';

interface MSell {
  title: string; 
}

const MSell: React.FC= () => {
  const navigate = useNavigate();
  const onClick = () => {
    console.log('Button clicked!');
    // Add your logic here
  };
  
  useSnackbar();

  return (
    <>
    
      {/*  
      <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      startIcon={<CameraAltIcon sx={{ fontSize: '50px' }}/>}
      sx={{
        position: 'fixed',
        borderRadius: '50%', // 角を完全に丸くする
        width: 70, // 幅を50pxに設定
        height: 70, // 高さを50pxに設定
        minWidth: 0, // ボタンの最小幅をオーバーライド
        padding: '0', // パディングを削除または調整
        bottom: 130, // 画面の下から20pxの位置
        right: 50, // 画面の右から20pxの位置
      }}

    >
    </Button>
    */}

      {/* メインコンテンツエリア */}
      {/* 見出し */}
      <CustomToolbar title="出品" showBackButton={false} />
      {/* メインボタンエリア */}
      <Box sx={{ mt: '3rem', pt: '4rem', ml: 4, mr: 4, mb: 6 }}>
        {/* 出品するボタン */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/sell')}
          sx={{
            width: '100%',
            height: 70,
            backgroundColor: '#EB4848',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            borderRadius: '8px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#D13C3C',
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CameraAltOutlinedIcon sx={{ fontSize: '2rem', mr: '0.5rem' }} />
          出品する
        </Button>

        {/* 下書き一覧ボタン */}
        <Button
          variant="outlined"
          onClick={() => navigate('/sell/draft')}
          sx={{
            width: '100%',
            height: 70,
            mt: 2,
            fontWeight: 'bold',
            fontSize: '1.2rem',
            color: '#EB4848',
            borderColor: '#EB4848',
            borderWidth: '2px',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: 'rgba(235, 72, 72, 0.08)',
              borderColor: '#D13C3C',
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BorderColorIcon sx={{ fontSize: '2rem', mr: '0.5rem' }} />
          下書き一覧
        </Button>
      </Box>
      <Divider variant="fullWidth" sx={{mx:4, my:3}}/>

      {/* 出品の流れの説明 */}
      <Box sx={{ mx: 4, mb: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <CameraAltIcon sx={{ color: 'red' }} />
          <Typography variant="h6" sx={{ color: '#404040', fontWeight: 'bold' }}>
            出品の流れ
          </Typography>
        </Stack>
      </Box>

    <Box sx={{ ml:4, mr:4, mb:1}}>
      <Grid container alignItems="center" sx={{ mb:1, alignItems: 'flex-start'}}>
        <Grid item xs={1}sx={{ 
            fontSize: 15,
            color: '#707070',
            fontWeight: '700'
            }}>
              1.
        </Grid>
        <Grid item xs={11}>
          <Typography sx={{ 
            color: '#707070',
            fontWeight: '700'
            }}> 
            交換に出す漫画タイトルを登録します。写真や状態など必要な情報を入力して下さい。
          </Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center" sx={{ mb:1, alignItems: 'flex-start'}}>
        <Grid item xs={1}sx={{ 
            fontSize: 15,
            color: '#707070',
            fontWeight: '700'
            }}>
              2.
        </Grid>
        <Grid item xs={11}>
          <Typography sx={{ 
            color: '#707070',
            fontWeight: '700'
            }}> 
            交換申し込みを待ちます。（この間に他のユーザーに申し込む事もできます）
          </Typography>
        </Grid>
      </Grid>
      
    </Box>
    <Divider variant="fullWidth" sx={{mx:4, my:3}}/>

    {/* 申し込みが来た場合の説明 */}
    <Box sx={{ mx: 4, mb: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <AutoAwesomeRoundedIcon sx={{ color: '#0F9ED5' }} />
          <Typography variant="h6" sx={{ color: '#404040', fontWeight: 'bold' }}>
            申し込みが来たら
          </Typography>
        </Stack>
      </Box>
    <Box sx={{ ml:4, mr:4, mb:'4.5rem',pb:'1.6rem' }}>
      <Grid container alignItems="center" sx={{ mb:1, alignItems: 'flex-start'}}>
        <Grid item xs={1}sx={{ 
            fontSize: 15,
            color: '#707070',
            fontWeight: '700'
            }}>
              1.
        </Grid>
        <Grid item xs={11}>
          <Typography sx={{ 
            color: '#707070',
            fontWeight: '700'
            }}> 
            通知に交換申込が来ます。交換したい漫画タイトルを選択します。
          </Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center" sx={{ mb:1, alignItems: 'flex-start'}}>
        <Grid item xs={1}sx={{ 
            fontSize: 15,
            color: '#707070',
            fontWeight: '700'
            }}>
              2.
        </Grid>
        <Grid item xs={11}>
          <Typography sx={{ 
            color: '#707070',
            fontWeight: '700'
            }}> 
            おめでとうございます。交換成立です！
          </Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center" sx={{ mb:1, alignItems: 'flex-start'}}>
        <Grid item xs={1}sx={{ 
            fontSize: 15,
            color: '#707070',
            fontWeight: '700'
            }}>
              3.
        </Grid>
        <Grid item xs={11}>
          <Typography sx={{ 
            color: '#707070',
            fontWeight: '700'
            }}> 
            漫画全巻の配送手続きを行ってください。
          </Typography>
        </Grid>
      </Grid>
    </Box>

    <MenuBar /> {/* 画像のボトムのナビゲーションバーに対応するコンポーネント */}
    </>
  );
};

export default MSell;
