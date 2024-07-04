import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

interface NavigateToLoginBoxProps {
    height: string;
  }

  const NavigateToLoginBox: React.FC<NavigateToLoginBoxProps> = ({ height }) => (
    <Box
        sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: height  // 画面全体の高さを使用
        }}
    >
        <Box sx={{ width: `85%`, justifyContent: 'center', textAlign: 'center' }}>
            <Typography variant='subtitle2' sx={{ textAlign: 'center', mb: `2rem`, color: '#404040' }}>
            会員登録またはログインを行うと、メルカリの様々な機能をご利用いただけます。
            </Typography>
            <Link to="/login-page" style={{ textDecoration: 'none' }}>
            <Button
                variant="outlined"
                sx={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: (theme) => theme.palette.primary.main, // テキストカラーをテーマのプライマリー色に
                borderColor: (theme) => theme.palette.primary.main, // 境界線をテーマのプライマリー色に
                borderWidth: `1px`,
                width: `100%`,
                borderRadius: '5px',
                '&:hover': {
                    background: 'rgba(0, 0, 0, 0.04)', // ホバー時の背景を軽く暗く
                    borderColor: (theme) => theme.palette.primary.main, // ホバー時の境界線をテーマのプライマリーの暗い色に
                    boxShadow: 'none',
                }
                }}
            >
                会員登録・ログイン
            </Button>
            </Link>
        </Box>
    </Box>
);

export default NavigateToLoginBox;
