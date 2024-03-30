import React from 'react';
import Chip from '@mui/material/Chip';
import {Box} from '@mui/material';

interface WishListProps {
  wishTitles: { title: string }[];
}

const WishListDisplay: React.FC<WishListProps> = ({ wishTitles }) => {
  return (
    <Box>
      <Box sx={{ mt: 2, pb:3}}>
        {wishTitles.map((wish, index) => (
          <Chip key={index} label={wish.title} variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
        ))}
      </Box>
    </Box>
  );
};

export default WishListDisplay;
