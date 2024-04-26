import React from 'react';
import { Toolbar, Typography } from '@mui/material';

type CustomToolbarProps = {
  title: string; // 出品の文字列を自由に設定できるようにPropsを定義
};

const CustomToolbar: React.FC<CustomToolbarProps> = ({ title }) => (
  <Toolbar disableGutters sx={{
    borderBottom: '0.05px solid #BFBFBF',
    background:`#FFFFFF`,
    boxShadow: '2px 0 4px -2px rgba(0, 0, 0, 0.2), -2px 0 4px -2px rgba(0, 0, 0, 0.2)' ,
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    right: 0,
    pl: 0,
    width: '100%',
    height:'3.5rem',
    zIndex: 1000,maxWidth: '640px',left: '50%',transform: 'translateX(-50%)',
  }}>
    <Typography variant="subtitle1" sx={{ 
      flexGrow: 1, 
      textAlign: 'center',
      fontWeight: '600',
      color: '#404040', // ここでcolorのプロパティをsxに移動
    }}>
      {title}
    </Typography>
  </Toolbar>
);

export default CustomToolbar;
