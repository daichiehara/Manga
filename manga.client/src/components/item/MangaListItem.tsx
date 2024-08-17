import React from 'react';
import { Card, CardMedia, CardContent, Typography, Grid, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import WishListDisplay from './WishListDisplay';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface MangaListItemProps {
  sellId: number;
  sellImage: string;
  sellTitle: string;
  numberOfBooks: number;
  wishTitles: { title: string; isOwned: boolean }[];
  onItemClick?: () => void;
  isSold: boolean;  // SOLD状態を管理するための新しいプロップ
}

const MangaListItem: React.FC<MangaListItemProps> = React.memo(({ sellId, sellImage, sellTitle, numberOfBooks, wishTitles, onItemClick, isSold }) => {
  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };
  
  return (
    <Link to={`/item/${sellId}`} style={{ textDecoration: 'none' }} onClick={handleClick}>
      <Card 
        sx={{ 
          display: 'flex', 
          margin: 0.9, 
          height: '13.5rem', 
          padding: 0,
          position: 'relative',  // relative positioning to allow absolute positioning of the SOLD tag
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
          
          {/* SOLDタグをここに追加 */}
          {isSold && (
            <Box 
              sx={{
                position: 'absolute', 
                top: 0, 
                left: 0, 
                backgroundColor: 'rgba(255, 0, 0, 0.8)', 
                color: 'white', 
                padding: '0.3rem 0.8rem', 
                fontSize: '0.9rem',
                fontWeight: 'bold',
                borderRadius: '0 0.5rem 0.5rem 0',
                zIndex: 10  // 画像の上に表示されるように
              }}
            >
              SOLD
            </Box>
          )}
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
