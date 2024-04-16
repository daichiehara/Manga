import React, { useState } from 'react';
import Button from '@mui/material/Button';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const MyComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setIsOpen(open);
  };

  return (
    <>
      <Button onClick={toggleDrawer(true)}>開く</Button>
      <SwipeableDrawer
        anchor='bottom'
        open={isOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={0}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
          BackdropProps: {
            invisible: true
          }
        }}
        // Drawerのスタイルをここで設定
        sx={{
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: 15, // 左上の角を丸くする
            borderTopRightRadius: 15, // 右上の角を丸くする
            width: 'auto', // 幅を自動に設定
            mx: 'auto', // 左右のマージンを自動で設定して中央に配置
          }
        }}
      >
        <Box
          sx={{
            width: 'auto', // 幅は自動で調整
            height: `50rem`,
            overflow: 'hidden', // 内容がはみ出したら隠す
            mx: 'auto', // 水平マージン自動で中央揃え
            mt: 2, // 上のマージンを設定
            mb: 2, // 下のマージンを設定（オプション）
          }}
          role="presentation"
        >
          <Typography sx={{ p: 2 }}>ここにコンテンツを入れます。</Typography>
          {/* 他のコンテンツ要素 */}
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default MyComponent;
