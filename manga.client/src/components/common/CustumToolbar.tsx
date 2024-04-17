import React from 'react';
import { Toolbar, Typography } from '@mui/material';

type CustomToolbarProps = {
  title: string; // 出品の文字列を自由に設定できるようにPropsを定義
};

const CustomToolbar: React.FC<CustomToolbarProps> = ({ title }) => (
  <Toolbar disableGutters sx={{
    borderBottom: '1px solid #F2F2F2',
    background: '#F2F2F2',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    
    right: 0,
    pl: 0,
    width: '100%',
    zIndex: 1000,maxWidth: '1024px',left: '50%',transform: 'translateX(-50%)',
  }}>
    <Typography variant="h6" sx={{ 
      flexGrow: 1, 
      textAlign: 'center',
      fontWeight: '600',
      color: '#757575', // ここでcolorのプロパティをsxに移動
    }}>
      {title}
    </Typography>
  </Toolbar>
);

export default CustomToolbar;
