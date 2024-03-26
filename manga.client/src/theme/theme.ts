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
    text: {
      primary: '#212121', // テキストの主色
      secondary: '#757575', // テキストの副色、ここを変更してください
    },
    background: {
      default: '#F2F2F2', // 背景色を設定
      // 他の背景色も必要に応じて設定可能です（例：paper: '#ffffff'）
    }
  },

});

export default theme;