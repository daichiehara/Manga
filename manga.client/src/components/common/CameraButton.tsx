import React from 'react';
import { Box, IconButton } from '@mui/material';
import { CameraAlt, PhotoLibrary } from '@mui/icons-material';

interface CameraButtonProps {
  onCameraClick: () => void;
  onAlbumClick: () => void;
  showAlbumIcon?: boolean; // 新しいプロパティを追加
}

const CameraButton: React.FC<CameraButtonProps> = ({ onCameraClick, onAlbumClick, showAlbumIcon = true }) => {
  return (
    <Box
      position="fixed"
      bottom={'4vh'}
      left={0}
      right={0}
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="white"
      mx={'auto'}
      sx={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}
    >
      {showAlbumIcon && ( // showAlbumIconがtrueの場合にのみPhotoLibraryアイコンを表示
        <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-370%)' }}>
          <IconButton onClick={onAlbumClick}>
            <PhotoLibrary sx={{ fontSize: '2rem', color: 'primary.main' }} />
          </IconButton>
        </Box>
      )}
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '50%',
          padding: '0.25rem',
          border: '3px solid',
          borderColor: 'primary.main',
        }}
      >
        <IconButton
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            border: '3px solid white',
            borderRadius: '50%',
            width: '4rem',
            height: '4rem',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
          size="medium"
          onClick={onCameraClick}
        >
          <CameraAlt sx={{ fontSize: '2rem' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CameraButton;