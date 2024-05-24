import React, { useState } from 'react';
import { Box, IconButton, Typography, Drawer } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SellCamera from './SellCamera';

const ImageList: React.FC = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleCameraClick = () => {
    setIsCameraOpen(true);
  };

  const handleCameraClose = () => {
    setIsCameraOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          py: 2,
          px: 2,
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              display: 'inline-block',
              minWidth: 80,
              width: 80,
              height: 80,
              border: '1px solid #ccc',
              borderRadius: 1,
              ml: index === 0 ? 0 : 1,
              textAlign: 'center',
              boxSizing: 'border-box',
            }}
          >
            {index === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <IconButton onClick={handleCameraClick}>
                  <CameraAltIcon sx={{ fontSize: 30, color: '#005FFF' }} />
                </IconButton>
              </Box>
            ) : null}
          </Box>
        ))}
      </Box>
      <Drawer
        anchor="bottom"
        open={isCameraOpen}
        onClose={handleCameraClose}
        disableScrollLock
        PaperProps={{
          style: {
            height: '97%', // Drawerの高さを80%に設定
            width: '100%', // Drawerの幅を100%に設定
            maxWidth: '640px',
            margin: 'auto',
            borderTopLeftRadius: 15, // 左上の角を丸くする
            borderTopRightRadius: 15, // 右上の角を丸くする
          },
        }}
      >
        <SellCamera />
      </Drawer>
    </>
  );
};

export default ImageList;
