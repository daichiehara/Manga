import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

interface CameraComponentProps {
    showFrame: boolean;  // boolean型と明示
    videoRef: React.RefObject<HTMLVideoElement>; // videoRefを追加
}

const CameraVideoComponent: React.FC<CameraComponentProps> = ({ showFrame, videoRef }) => {
    const theme = useTheme();
    const notLgMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('ise'));

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: isSmallScreen ? '3.5rem' : { xs: '15vh', sm: '4rem' } }}>
      <Box sx={{ width: '100%', maxWidth: notLgMobile ? '640px' : '300px', aspectRatio: '1/1', position: 'relative', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {showFrame && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '85.6%',
              height: '54.0%',
              border: '4px solid #1E90FF',
              borderRadius: '10px',
              boxSizing: 'border-box',
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default CameraVideoComponent;
