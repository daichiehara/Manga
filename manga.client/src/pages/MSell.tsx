import React from 'react';
import { Box, Typography, Button, AppBar, Toolbar} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import MenuBar from '../components/menu/MenuBar';
import Header from '../components/common/Header';

const MSell: React.FC = () => {

  return (
    <>
      <Header  />
      
      {/* メインコンテンツエリア */}
      {/* 見出し */}
      <Box sx={{ position: 'relative', width: '100%',marginTop:11 }}> {/* AppBarを包むためのコンテナを作成します */}
      <AppBar position="absolute" color="default" elevation={1} sx={{
        top: '50%', // 上部から50%の位置
        left: '50%', // 左から50%の位置
        transform: 'translate(-50%, -50%)', // X軸とY軸の中心から50%ずつ移動して中央に配置
        width: '100%', // 必要に応じて幅を調整
      }}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, textAlign: 'center' }}>
            出品
          </Typography>
        </Toolbar>
      </AppBar>
      </Box>


      <Box sx={{ margin: 2 }}>
        {/* 出品ボタン */}
        <Button
          startIcon={<AddAPhotoIcon />}
          variant="outlined"
          sx={{ width: '100%', height: 70,marginTop:13}}
        >
          漫画全巻を出品する
        </Button>
      </Box>

      <MenuBar /> {/* 画像のボトムのナビゲーションバーに対応するコンポーネント */}
    </>
  );
};

export default MSell;
