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
  },
  // 他のテーマ設定...
});

export default theme;