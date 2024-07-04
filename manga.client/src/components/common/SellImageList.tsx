import React, { useState } from 'react';
import { Box, IconButton, Button, SwipeableDrawer } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SellCamera from './SellCamera';

interface ImageListProps {
  capturedImages: string[];
  onCapturedImagesChange: (images: string[]) => void;
}

const ImageList: React.FC<ImageListProps> = ({ capturedImages, onCapturedImagesChange }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleCameraClick = () => {
    setIsCameraOpen(true);
  };

  const handleCameraClose = () => {
    setIsCameraOpen(false);
    setSelectedImageIndex(null);
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsCameraOpen(true);
  };

  return (
    <>
      <Box sx={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', py: 2, px: 2 }}>
        {Array.from({ length: 10 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              display: 'inline-block',
              minWidth: 80,
              width: 80,
              height: 80,
              border: '1px solid #ccc',
              borderRadius: 2,
              ml: index === 0 ? 0 : 1,
              textAlign: 'center',
              boxSizing: 'border-box',
              cursor: capturedImages[index] ? 'pointer' : 'default',
            }}
            onClick={() => capturedImages[index] && handleImageClick(index)}
          >
            {capturedImages[index] ? (
              <img
                src={capturedImages[index]}
                alt={`Captured ${index}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
            ) : index === capturedImages.length ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  height: '100%',
                  cursor: 'pointer',
                }}
                onClick={handleCameraClick}
              >
                <CameraAltIcon sx={{ fontSize: 30, color: '#005FFF' }} />
              </Box>
            ) : null}
          </Box>
        ))}
      </Box>
      <SwipeableDrawer
        anchor="bottom"
        open={isCameraOpen}
        onClose={handleCameraClose}
        onOpen={() => setIsCameraOpen(true)}
        disableBackdropTransition
        disableDiscovery
        disableSwipeToOpen
        swipeAreaWidth={0}
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
              right: 8,
              zIndex: 1,
            }}
            onClick={handleCameraClose}
          >
            完了
          </Button>
          {isCameraOpen && (
            <SellCamera
              capturedImages={capturedImages}
              onCapturedImagesChange={onCapturedImagesChange}
              initialSelectedImageIndex={selectedImageIndex}
            />
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default ImageList;