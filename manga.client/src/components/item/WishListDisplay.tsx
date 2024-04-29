import React from 'react';
import Chip from '@mui/material/Chip';
import { Box, Typography } from '@mui/material';

interface WishListProps {
  wishTitles: { title: string; isOwned: boolean }[];
}

const WishListDisplay: React.FC<WishListProps> = ({ wishTitles }) => {
  const displayTitles = wishTitles.length > 3 ? wishTitles.slice(0, 3) : wishTitles;
  const moreExists = wishTitles.length > 3;

  return (
    <Box sx={{ mt: 2, pb: 3, display: 'flex', flexWrap: 'wrap' }}>
      {displayTitles.map((wish, index) => (
        <Chip
          key={index}
          label={wish.title}
          variant="outlined"
          sx={{
            mr: 0.5,
            mb: 0.5,
            backgroundColor: wish.isOwned ? 'red' : 'transparent',
            color: wish.isOwned ? 'white' : 'inherit',
            '&:hover': {
              backgroundColor: wish.isOwned ? 'darkred' : 'inherit',
            },
          }}
        />
      ))}
      {moreExists && (
        <Typography component="span" sx={{ alignSelf: 'center' }}>...</Typography>
      )}
    </Box>
  );
};

export default WishListDisplay;
