import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

interface ShowImageProps {
  selectedImage: string;
  mt?: boolean;
}

const ImageShow: React.FC<ShowImageProps> = ({ selectedImage, mt = true }) => {
  const theme = useTheme();
  const notLgMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('ise'));

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: mt ? (isSmallScreen ? '3.5rem' : { xs: '15vh', sm: '4rem' }) : 0,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: notLgMobile ? '640px' : '300px',
          aspectRatio: '1/1',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={selectedImage}
          alt="Captured"
          style={{
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>
    </Box>
  );
};

export default ImageShow;