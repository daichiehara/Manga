import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import CustomToolbar from '../components/common/CustumToolbar';
import { Check, CameraAlt } from '@mui/icons-material';

const CameraPage: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };
    startCamera();
  }, []);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const capturedImage = canvas.toDataURL('image/png');
      setCapturedImage(capturedImage);
    }
  };

  const handleUpload = async () => {
    if (capturedImage) {
      // 画像をアップロードする処理
      // ...
    }
  };

  return (
    <>
      <CustomToolbar title="本人確認 - 撮影" />
      <Box sx={{ mt: isMobile ? '7rem' : '4rem' }}>
        {capturedImage ? (
          <>
          <Box sx={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden' }}>
            <img
              src={capturedImage}
              alt="Captured"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                height: '100%',
                width: 'auto',
                objectFit: 'cover',
              }}
            />
          </Box>
          <Box display="flex" justifyContent="space-around" mt={2}>
            <Button variant="contained" color="primary" startIcon={<Check />} onClick={handleUpload} component={Link} to="/id-verification">
              アップロード
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setCapturedImage(null)}>
              撮り直す
            </Button>
          </Box>
        </>
      ) : (
        <>
            <Box sx={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden' }}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                height: '100%',
                width: 'auto',
                maxHeight: '400px',
                objectFit: 'cover',
                }}
            />
            </Box>
            
                <Box 
                    position="fixed" 
                    bottom={'3rem'} 
                    left={0} 
                    right={0} 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    height={'10rem'} 
                    padding={1} 
                    bgcolor="white">
                <IconButton
                    sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    border: '4px solid white',
                    borderRadius: '50%',
                    width: '6rem',
                    height: '6rem',
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                    },
                    }}
                    size="large"
                    onClick={handleCapture}
                >
                    <CameraAlt sx={{fontSize: '3rem'}} />
                </IconButton>
                </Box>

                
            
        </>
        )}
      </Box>
    </>
  );
};

export default CameraPage;