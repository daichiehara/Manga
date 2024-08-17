import React from 'react';
import { Card, CardMedia, CardContent, Typography, Grid, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import WishListDisplay from './WishListDisplay';

// SellStatusの定義
enum SellStatus {
  Recruiting = 1,
  Suspended = 2,
  Establish = 3,
  Draft = 4,
}

interface MangaListItemProps {
  sellId: number;
  sellImage: string;
  sellTitle: string;
  numberOfBooks: number;
  wishTitles: { title: string; isOwned: boolean }[];
  sellStatus: SellStatus;  // 売り状態のプロップを追加
  onItemClick?: () => void;
}

const MangaListItem: React.FC<MangaListItemProps> = React.memo(({ sellId, sellImage, sellTitle, numberOfBooks, wishTitles, sellStatus, onItemClick }) => {
  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  // 売り状態に応じてタグを表示する関数
  const renderStatusTag = () => {
    if (sellStatus === SellStatus.Suspended) {
      return (
        <Box 
          sx={{
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '80px', 
            height: '80px',
            backgroundColor: 'rgba(255, 165, 0, 0.9)',  // オレンジ色の背景
            color: 'white', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            clipPath: 'polygon(0 0, 100% 0, 0 100%)',  // 左上の直角三角形
            zIndex: 100
          }}
        >
          <Typography
            sx={{
              transform: 'rotate(-45deg)',  // 45度左に傾ける
            }}
          >
            公開停止中
          </Typography>
        </Box>
      );
    } else if (sellStatus === SellStatus.Establish) {
      return (
        <Box 
          sx={{
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '80px', 
            height: '80px',
            backgroundColor: 'rgba(255, 0, 0, 0.9)',  // 赤色の背景
            color: 'white', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            clipPath: 'polygon(0 0, 100% 0, 0 100%)',  // 左上の直角三角形
            zIndex: 100  
          }}
        >
          <Typography
            sx={{
              transform: 'rotate(-45deg)',  // 45度左に傾ける
              position: 'relative',
              top: '-10px',  // 文字を上にずらす
              left: '-10px',  // 文字を左にずらす
              fontWeight:'bold',
              fontSize: '0.8rem',
            }}
          >
            交換成立
          </Typography>
        </Box>
      );
    }
    return null; // 他のステータスの場合は何も表示しない
  };

  return (
    <Link to={`/item/${sellId}`} style={{ textDecoration: 'none' }} onClick={handleClick}>
      <Card 
        sx={{ 
          display: 'flex', 
          margin: 0.9, 
          height: '13.5rem', 
          padding: 0,
          position: 'relative',  // relative positioning to allow absolute positioning of the status tag
          border: '0.05px solid rgba(0, 0, 0, 0.1)', 
          borderRadius: '3px', 
          boxShadow: 'none' 
        }}
      >
        <Box sx={{
          width: '45%',  
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F2F2F2' 
        }}>
          <CardMedia
            component="img"
            sx={{ 
              width: '98%',  
              height: '98%',  
              objectFit: 'contain'  
            }}
            image={sellImage}
            alt={`Cover of ${sellTitle}`}
          />
          
          {/* 状態タグをここに表示 */}
          {renderStatusTag()}
        </Box>
        <CardContent sx={{ 
          pt:0.8,
          pl: 1.3,
          pr:0.5,
          width: '55%',  
          height: 'auto',
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'flex-start',
          overflow: 'hidden' 
        }}>
          <Grid container spacing={0} alignItems="center">
            <Typography 
              variant="body2" 
              sx={{ 
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                WebkitLineClamp: 2,  
                textOverflow: 'ellipsis' 
              }}
            >
              {sellTitle}
            </Typography>
          </Grid>
          <Typography variant="subtitle2"  sx={{color: '#B12704', py:0.1}}>
              全巻
            <Box component="span" sx={{ color: '#757575',pl:1 }}>({numberOfBooks}巻)</Box>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', py: 0.1 }}>
            <Typography variant="subtitle2" component="span" sx={{mb:0.2, color: "#0F9ED5", fontWeight:`bold`, fontStyle:'italic' }}>
              want<Box component="span" sx={{ color: 'orange' }}>!!</Box>
            </Typography>
            <Typography variant="subtitle2" component="span" sx={{ml:0.5, mb:0.2, color: "#757575", fontSize:'0.7rem' }}>
              交換希望の漫画
            </Typography>
            
          </Box>
          {wishTitles && <WishListDisplay wishTitles={wishTitles} shouldTruncate={true} />}
        </CardContent>
      </Card>
    </Link>
  );
});

export default MangaListItem;
