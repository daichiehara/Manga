import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import CustomToolbar from '../components/common/CustumToolbar';
import { Check, CameraAlt } from '@mui/icons-material';
import axios from 'axios';

const CameraPage: React.FC = () => {
  window.scrollTo({top:0, behavior: "instant"});

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const theme = useTheme();
  const isLgMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
  
    useEffect(() => {  
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

  const generateRandomString = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  
  const handleUpload = async () => {
    if (capturedImage) {
      try {
        const response = await fetch(capturedImage);
        const blob = await response.blob();
        const formData = new FormData();
  
        // 現在のタイムスタンプとランダムな文字列を組み合わせて一意のファイル名を生成
        const timestamp = Date.now();
        const randomString = generateRandomString(8);
        const fileName = `captured-image-${timestamp}-${randomString}.png`;
  
        formData.append('file', blob, fileName);
  
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        };
  
        const result = await axios.post('https://localhost:7103/api/Users/uploadIdVerificationImage', formData, config);
  
        if (result.status === 200) {
          console.log('Image uploaded successfully');
          // アップロード成功後の処理を追加
        } else {
          console.error('Failed to upload image');
          // アップロード失敗時の処理を追加
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        // エラー処理を追加
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <>
      <CustomToolbar title="本人確認 - 撮影" />
      <Box sx={{ mt: isLgMobile ? '15vh' : '4rem' }}>
        {capturedImage ? (
          <>
          <Box sx={{ position: 'relative', width: '100%', paddingTop: '430px', overflow: 'hidden' }}>
          <img
              src={capturedImage}
              alt="Captured"
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                height: '100%',
                width: 'auto',
                maxHeight: '430px',
                maxWidth: '430px',
                objectFit: 'cover',
              }}
            />
          </Box>
          <Box display="flex" justifyContent="space-around" mt={2}>
            <Button variant="contained" color="primary" startIcon={<Check />} onClick={handleUpload} component={Link} to="/id-verification">
              アップロード
            </Button>
            <Button variant="contained" color="secondary" onClick={handleRetake}>
                撮り直す
              </Button>
          </Box>
        </>
      ) : (
        <>
            <Box sx={{ position: 'relative', width: '100%', paddingTop: '430px', paddingBottom:0, overflow: 'hidden' }}>
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
                maxHeight: '430px',
                maxWidth: '430px',
                objectFit: 'cover',
                }}
            />
            </Box>
            
            <Box
            position="fixed"
            bottom={'4vh'}
            left={0}
            right={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={'8rem'}
            padding={1}
            bgcolor="white"
            //maxWidth={'400px'}
            mx={'auto'}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}
            >
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
                    onClick={handleCapture}
                    >
                    <CameraAlt sx={{ fontSize: '2rem' }} />
                    </IconButton>
                </Box>
            </Box>         
        </>
        )}
      </Box>
    </>
  );
};

export default CameraPage;