import React from 'react';
import { Box, Toolbar, Typography, IconButton } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useCustomNavigate } from '../../hooks/useCustomNavigate'; 
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

type CustomTocaeruToolbarProps = {
  showBackButton?: boolean;  // 戻るボタンの表示可否
  showSubtitle?: boolean;    // サブタイトルの表示可否
  subtitle?: string | null;  // 表示するサブタイトルのテキスト
};

const CustomTocaeruToolbar: React.FC<CustomTocaeruToolbarProps> = ({
  showBackButton = false, 
  showSubtitle = false, 
  subtitle = null 
}) => {
  const customNavigate = useCustomNavigate();  // カスタムナビゲーション関数
  const navigate = useNavigate();              // React Routerのナビゲート機能
  const theme = useTheme();                    // MUIテーマ

  return (
    <>
      {/* ツールバー */}
      <Toolbar
        disableGutters
        sx={{
          borderBottom: '0.05px solid #BFBFBF',  // 下部ボーダー
          backgroundColor: '#FFFFFF',            // 背景色
          boxShadow: '2px 0 4px -2px rgba(0, 0, 0, 0.2), -2px 0 4px -2px rgba(0, 0, 0, 0.2)',  // ボックスシャドウ
          display: 'flex',
          alignItems: 'center',
          position: 'fixed',                     // 固定位置
          top: 0,
          right: 0,
          pl: 0,
          pr: 0,
          width: '100%',
          height: '3.5rem',
          zIndex: 1000,
          maxWidth: '640px',                     // 最大幅640px
          left: '50%',
          transform: 'translateX(-50%)',         // 中央揃え
        }}
      >
        {/* 戻るボタンの表示条件 */}
        {showBackButton ? (
          <IconButton
            edge="start"
            aria-label="back"
            onClick={() => customNavigate()}
            sx={{ width: 48, height: 48, color: '#404040' }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 24 }} />
          </IconButton>
        ) : (
          // 戻るボタンがない場合のスペーサー
          <Box sx={{ width: 48, height: 48 }} />
        )}

        {/* 中央のロゴ */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Box
            component="img"
            src="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp"
            alt="Tocaeru Logo"
            sx={{ width: 155, cursor: 'pointer' }}
            onClick={() => navigate('/')}  // ロゴクリックでホームに遷移
          />
        </Box>
        
        {/* 右側のスペーサー */}
        <Box sx={{ width: 48, height: 48 }} />
      </Toolbar>

      {/* サブタイトルの表示条件 */}
      {showSubtitle && (
        <Box sx={{ mt: '3.5rem', pt: '1.2rem', display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            {subtitle}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default CustomTocaeruToolbar;
