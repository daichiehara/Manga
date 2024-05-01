// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E97032',
    },
    secondary: {
      main: '#E97032',
    },
    info:{
      main: '#E97032',
    },
    text: {
      primary: '#212121', // Main text color
      secondary: '#757575', // Updated secondary text color
      
    },
    background: {
      default: '#F2F2F2', // 背景色を設定
      // 他の背景色も必要に応じて設定可能です（例：paper: '#ffffff'）
    }
  },
  typography: {
    fontFamily: 'Yu Gothic, "YuGothic", "游ゴシック体", "游ゴシック Medium", "游ゴシック", sans-serif',
  },

});

export default theme;