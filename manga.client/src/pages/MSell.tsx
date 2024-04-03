import React from 'react';
import { Box, Typography, Button, AppBar, Toolbar} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import PublishIcon from '@mui/icons-material/Publish';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import MenuBar from '../components/menu/MenuBar';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
}

const MSell: React.FC<ActionButtonProps> = ({ label, onClick }) => {

  return (
    <>

      {/* アクションボタン */}
      <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      startIcon={<AddAPhotoIcon sx={{ fontSize: '50px' }}/>}
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
      {label}
    </Button>

      {/* メインコンテンツエリア */}
      {/* 見出し */}
      <AppBar position="fixed" color="default" sx={{
        background: 'linear-gradient(to right, #E97132, #F2CFEE)', // グラデーションの背景色
        boxShadow: 'none',
        
      }}>
        <Toolbar sx={{
          justifyContent: 'center', // Toolbar内の要素を中央揃えに
          mt: 0.5,
          mb: 0.5, 
          boxShadow: '0px 4px 4px -1px rgba(0,0,0,0.1)',
      }}>
          <Typography variant="h5" color="white" sx={{ 
            flexGrow: 1, 
            textAlign: 'center',
            fontWeight: '600',
            }}>
            出品
          </Typography>
        </Toolbar>
      </AppBar>


      <Box sx={{ mt:11, ml:4, mr:4}}>
        {/* 出品ボタン */}
      <Typography 
        variant="h6" sx={{ 
          color: '#707070',
          fontWeight: '700',
          mb:2
          }} >
        出品する
      </Typography>
        <Button
          startIcon={<AddAPhotoIcon />}
          variant="outlined" sx={{ 
            width: '100%', 
            height: 70, 
          }}
        >
          漫画全巻を出品する
        </Button>
      </Box>


    <Box sx={{ m:4, mb: 4}}>
      <Typography 
        variant="h6" sx={{ 
          color: '#707070',
          fontWeight: '700'
          }} >
        <PublishIcon/>
        出品の流れ
      </Typography>
      <Typography 
        sx={{ 
          fontSize: 16,
          color: '#707070',
          fontWeight: '700'
          }} >
        1 交換に出す漫画タイトルを登録します。<br />
        2 交換申し込みを待ちます。（この間に他のユーザーに申し込む事もできます。）<br />
        ※ 「欲しい漫画」はあなたがMy本棚で登録した漫画です。
      </Typography>
    </Box>


    <Box sx={{ m:4,}}>
      <Typography 
        variant="h6" sx={{ 
          color: '#707070',
          fontWeight: '700'
          }} >
        <AssignmentTurnedInIcon/>
        申し込みが来たら
      </Typography>
      <Typography 
        sx={{ 
          fontSize: 16,
          color: '#707070',
          fontWeight: '700'
          }} >
        1 通知に交換申込が来ます。交換したい漫画タイトルを選択します。<br />
        2 おめでとうございます。交換成立です！<br />
        3 漫画全巻の配送手続きを行ってください。
      </Typography>
    </Box>

      <MenuBar /> {/* 画像のボトムのナビゲーションバーに対応するコンポーネント */}
    </>
  );
};

export default MSell;
