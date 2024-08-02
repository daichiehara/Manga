import React from 'react';
import { Box, Toolbar, Typography, IconButton } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useCustomNavigate } from '../../hooks/useCustomNavigate'; // パスは適宜調整してください
import { useTheme } from '@mui/material/styles';
import { Navigate, useNavigate } from 'react-router-dom';

type CustomTocaeruToolbarProps = {
  showBackButton?: boolean;
  showSubtitle?: boolean;
  subtitle?: string | null;
};

const CustomTocaeruToolbar: React.FC<CustomTocaeruToolbarProps> = ({ showBackButton = false, showSubtitle= false, subtitle=null }) => {
  const customNavigate = useCustomNavigate();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <>
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
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' , }}>
      <img
            src="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp"
            alt="Tocaeru Logo"
            style={{ width: '155px', cursor: 'pointer' }} // ロゴのサイズとマージンを調整
            onClick={() => navigate('/')}
          />
      </Box>
      <div style={{ width: 48, height: 48 }} />
    </Toolbar>
    {showSubtitle && (
        <Box sx={{mt:'3.5rem',  pt:'1.2rem', display:'flex', justifyContent:'center'}}>
            <Typography variant='h6' sx={{fontWeight:'bold', color:theme.palette.text.primary}} >
                {subtitle}
            </Typography>
        </Box>
    )}
    
    </>
  );
};

export default CustomTocaeruToolbar;
