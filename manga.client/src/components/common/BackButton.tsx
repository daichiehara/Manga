import React from 'react';
import { Box, IconButton, IconButtonProps } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

interface BackButtonProps extends IconButtonProps {
  handleBack: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ handleBack, ...rest }) => (
  <Box
    sx={{
      // バックボタンを画面に固定するための設定
      position: 'fixed',
      zIndex: 10000,  // 他の要素より上に表示されるようにするための設定
      top: 8,
      left: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      // メディアクエリで画面サイズに応じて位置を調整
      '@media (max-width: 640px)': {
        // スマホサイズの場合、左上から8pxの位置に固定
        left: '8px',
        top: '8px',
      },
      '@media (min-width: 641px)': {
        // パソコンサイズの場合、640px幅の中央に合わせて配置
        left: 'calc(50% - 320px + 8px)',
        top: '8px',
      },
    }}
  >
    <IconButton
      onClick={handleBack}
      {...rest}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.5)',  // ボタンの背景色
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',  // ホバー時の背景色
        },
      }}
    >
      <ArrowBackIosNewIcon />
    </IconButton>
  </Box>
);

export default BackButton;
