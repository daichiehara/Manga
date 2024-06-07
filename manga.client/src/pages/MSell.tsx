import React from 'react';
import { Box, Typography, Button, Grid,  } from '@mui/material';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import PublishIcon from '@mui/icons-material/Publish';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import MenuBar from '../components/menu/MenuBar';
import CustomToolbar from '../components/common/CustumToolbar';
import { Link } from 'react-router-dom';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useSnackbar } from '../hooks/useSnackbar';

interface MSell {
  title: string; 
}

const MSell: React.FC= () => {
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
      <CustomToolbar title='出品'/>
        {/* 出品ボタン */}
      <Box sx={{ml:4, mr:4, mb: 6,}}>
      <Typography 
        variant="h6" sx={{ 
          pt:10,
          color: '#707070',
          fontWeight: '700',
          mb:2
          }} >
        出品する
      </Typography>
      <Link to="/sell">
        <Button
          variant="outlined" sx={{ 
            borderWidth:`1px`,
            borderColor: (theme) => theme.palette.primary.main, 
            width: '100%', 
            height: 70, 
            fontWeight: '700',
            fontSize: '1.1rem',
          }}
        >
          <CameraAltOutlinedIcon sx={{pr:`0.6rem`, fontSize: '1.5rem' }} />
          漫画全巻を出品する
        </Button>
      </Link>

      <Link to="/sell/draft">
        <Button
          variant="outlined" 
          size='small'
          sx={{ 
            width: '100%',
            mt: 2
          }}
        >
          <BorderColorIcon sx={{pr: '0.6rem'}} />
          下書き一覧
        </Button>
      </Link>
      </Box>

      {/* 出品の流れの説明 */}
    <Box sx={{ ml:4, mr:4, mb:1.5}}>
    <Grid container alignItems="center" >
      <Grid item xs={1}sx={{ 
          display: 'flex', 
          justifyContent: 'center', // 横方向の中央揃え
          alignItems: 'center', // 垂直方向の中央揃え
          color: '#707070',
          fontWeight: '700'
          }}>
        <PublishIcon/>
      </Grid>
      <Grid item xs={11}>
        <Typography 
        variant="h6"sx={{ 
          color: '#707070',
          fontWeight: '700'
          }}> 
          出品の流れ
        </Typography>
      </Grid>
    </Grid>
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
          交換に出す漫画タイトルを登録します。
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
          交換申し込みを待ちます。（この間に他のユーザーに申し込む事もできます。）
        </Typography>
      </Grid>
    </Grid>
    <Grid container alignItems="center" sx={{ mb:6, alignItems: 'flex-start'}}>
      <Grid item xs={1}sx={{ 
          fontSize: 15,
          color: '#707070',
          fontWeight: '700'
          }}>
            ※
      </Grid>
      <Grid item xs={11}>
        <Typography sx={{ 
          color: '#707070',
          fontWeight: '700',
          fontSize: 15,
          }}> 
      「欲しい漫画」はあなたがMy本棚で登録した漫画です。
        </Typography>
      </Grid>
    </Grid>
    </Box>


      {/* 申し込みが来た場合の説明 */}
    <Box sx={{ ml:4, mr:4, mb:1.5}}>
    <Grid container alignItems="center">
      <Grid item xs={1}sx={{ 
          display: 'flex', 
          justifyContent: 'center', // 横方向の中央揃え
          alignItems: 'center', // 垂直方向の中央揃え
          color: '#707070',
          fontWeight: '700'
          }}>
        <AssignmentTurnedInIcon/>
      </Grid>
      <Grid item xs={11}>
        <Typography 
        variant="h6"sx={{ 
          color: '#707070',
          fontWeight: '700'
          }}> 
          申し込みが来たら
        </Typography>
      </Grid>
    </Grid>
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
