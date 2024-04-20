import React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import BooksTabs from './BooksTabs';

interface MyBookModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MyBookModal: React.FC<MyBookModalProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <SwipeableDrawer
        anchor='bottom'
        open={isOpen}
        onClose={onClose}
        onOpen={() => onClose()}  // このonOpenは本来の意図に合わせて適切に設定する必要があります。
        swipeAreaWidth={0}  // より具体的な値に設定
        disableSwipeToOpen={false}  // デフォルトの動作を維持
        ModalProps={{
          keepMounted: true,
          BackdropProps: {
            invisible: true
          }
        }}
        sx={{
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            width: 'auto',
            mx: 'auto',
          }
        }}
      >
        <Box
          sx={{
            width: 'auto',
            height: 500, // 「rem」単位からピクセル単位に変更
            overflow: 'hidden',
            mx: 'auto',
            mt: 2,
            mb: 2,
            p: 2  // パディングを追加
          }}
          role="presentation"
        >
          
          {/* 他のコンテンツ要素 */}
          <BooksTabs />
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default MyBookModal;
