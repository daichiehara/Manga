// theme.ts
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    ise: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#E97032',
    },
    secondary: {
      main: '#757575',
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
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
      ise: 400,
    },
  },
});

export default theme;