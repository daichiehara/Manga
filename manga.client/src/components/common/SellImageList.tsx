import React, { useState } from 'react';
import { Box, IconButton, Button, Drawer } from '@mui/material';
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
            height: '97%',
            width: '100%',
            maxWidth: '640px',
            margin: 'auto',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Button
            variant="text"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 1,
              //color: 'white',
            }}
            onClick={handleCameraClose}
          >
            キャンセル
          </Button>
          <SellCamera />
        </Box>
      </Drawer>
    </>
  );
};

export default ImageList;
