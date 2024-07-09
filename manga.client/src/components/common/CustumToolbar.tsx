import React from 'react';
import { Toolbar, Typography, IconButton } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useCustomNavigate } from '../../hooks/useCustomNavigate'; // パスは適宜調整してください

type CustomToolbarProps = {
  title: string;
  showBackButton?: boolean;
};

const CustomToolbar: React.FC<CustomToolbarProps> = ({ title, showBackButton = true }) => {
  const customNavigate = useCustomNavigate();

  return (
    <Toolbar disableGutters sx={{
      borderBottom: '0.05px solid #BFBFBF',
      background: '#FFFFFF',
      boxShadow: '2px 0 4px -2px rgba(0, 0, 0, 0.2), -2px 0 4px -2px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      right: 0,
      pl: 0,
      pr: 0,
      width: '100%',
      height: '3.5rem',
      zIndex: 1000,
      maxWidth: '640px',
      left: '50%',
      transform: 'translateX(-50%)',
    }}>
      {showBackButton ? (
        <IconButton
          edge="start"
          aria-label="back"
          onClick={() => customNavigate()}
          sx={{ width: 48, height: 48, color: '#404040' }}
        >
          <ArrowBackIosNewRoundedIcon sx={{fontSize:24, pl: 0}} />
        </IconButton>
      ) : (
        <div style={{ width: 48, height: 48 }} /> // 空のスペーサー
      )}
      <Typography variant="subtitle1" sx={{ 
        flexGrow: 1, 
        textAlign: 'center',
        fontWeight: '600',
        color: '#404040',
      }}>
        {title}
      </Typography>
      <div style={{ width: 48, height: 48 }} />
    </Toolbar>
  );
};

export default CustomToolbar;