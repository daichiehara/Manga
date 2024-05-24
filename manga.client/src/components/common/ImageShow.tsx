import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

interface ShowImageProps {
  selectedImage: string;
  mt?: boolean; // mtをオプショナルなプロパティとして追加
}

const ImageShow: React.FC<ShowImageProps> = ({ selectedImage, mt = true }) => {
  const theme = useTheme();
  const notLgMobile = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: mt ? { xs: '15vh', sm: '4rem' } : 0, // mtがtrueの場合にのみ適用
      }}
    >
      <Box sx={{ width: '100%', maxWidth: notLgMobile ? '640px' : '430px', aspectRatio: '1/1' }}>
        <img
          src={selectedImage}
          alt="Captured"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>
    </Box>
  );
};

export default ImageShow;
