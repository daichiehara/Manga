import React from 'react';
import { Box, Typography } from '@mui/material';

interface WishListProps {
  wishTitles: { title: string; isOwned: boolean }[];
}

const WishListDisplay: React.FC<WishListProps> = ({ wishTitles }) => {
  const displayTitles = wishTitles.length > 100 ? wishTitles.slice(0, 3) : wishTitles;
  const moreExists = wishTitles.length > 100;

  return (
    <Box sx={{ mt: 0.5, pb: 3, display: 'flex', flexWrap: 'wrap' }}>
      {displayTitles.map((wish, index) => (
        <Box
        key={index}
        sx={{
          m: 0.4,
          ml: 0, // 一番右端の隙間を作らないために
         
          color: wish.isOwned ? 'white' : 'inherit',
          borderRadius: '100px',
          border: '1px solid',
          borderColor: wish.isOwned ? '#0F9ED5' : 'rgba(0, 0, 0, 0.23)', // 透明な背景の場合の境界線
          '&:hover': {
            backgroundColor: wish.isOwned ? 'darkred' : 'inherit',
          },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            px:1.3,
            py:0.4,
            fontSize: '0.75rem', // フォントサイズを小さくする
            color: wish.isOwned ? 'black' : '#757575',
          }}
        >
          {wish.title}
        </Typography>
      </Box>
      ))}
      {moreExists && (
        <Typography component="span" sx={{ alignSelf: 'center' }}>...</Typography>
      )}
    </Box>
  );
};

export default WishListDisplay;
