import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Grid, useTheme, useMediaQuery } from '@mui/material';
import CameraVideoComponent from './CameraVideo';
import ImageShow from './ImageShow';
import { useNavigate } from 'react-router-dom';

const SellCamera: React.FC = () => {
  window.scrollTo({top:0, behavior: "instant"});
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const navigate = useNavigate();
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const theme = useTheme();
  const notLgMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const constraints: MediaStreamConstraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'environment',
          },
        };
    
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setVideoStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
  
          const videoTrack = stream.getVideoTracks()[0];
          const settings = videoTrack.getSettings();
  
          // facingModeが利用可能か確認
          if (settings.facingMode) {
            console.log("Current facing mode:", settings.facingMode);
            videoRef.current.style.transform = settings.facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)';
          } else {
            console.log("facingMode is not available in the settings.");
          }
        }
      } catch (error: unknown) {
          console.error('Error accessing camera:', error);
        
          if (error instanceof Error) {
            if (error.name === 'NotAllowedError') {
              // NotAllowedErrorの場合の処理
              alert('撮影を開始するにはカメラのアクセスを許可する必要があります。');
              // 前の画面に戻る
              navigate(-1);
            } else if (error.name === 'PermissionDeniedError') {
              // PermissionDeniedErrorの場合の処理
              alert('カメラのアクセスが拒否されました。ブラウザの設定でカメラのアクセスを許可してください。');
              // 前の画面に戻る
              navigate(-1);
            } else {
              // その他のエラーの場合の処理
              alert('カメラへのアクセスエラーが発生しました。');
              // 前の画面に戻る
              navigate(-1);
            }
          } else {
            // error が Error 型でない場合の処理
            alert('カメラへのアクセスエラーが発生しました。');
            // 前の画面に戻る
            navigate(-1);
          }
        }
    };

    startCamera();
  }, []);
  
  useEffect(() => {
    return () => {
      if (videoStream) {
        console.log("Stopping camera");
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);  // videoStreamを依存配列に追加

  

  const handleCapture = () => {
    if (videoRef.current) {
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
  
      const cropSize = Math.min(videoWidth, videoHeight);
      const cropX = (videoWidth - cropSize) / 2;
      const cropY = (videoHeight - cropSize) / 2;
  
      const canvas = document.createElement('canvas');
      canvas.width = cropSize;
      canvas.height = cropSize;
  
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(
          videoRef.current,
          cropX,
          cropY,
          cropSize,
          cropSize,
          0,
          0,
          cropSize,
          cropSize
        );
  
        const capturedImage = canvas.toDataURL('image/png');
        setCapturedImages(prevImages => [...prevImages, capturedImage]);
      }
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <Box>
      {selectedImageIndex !== null ? (
        <ImageShow selectedImage={capturedImages[selectedImageIndex]} />
      ) : (
        <CameraVideoComponent showFrame={false} videoRef={videoRef} />
      )}
        <Box sx={{ overflowX: 'auto',display: 'flex', flexWrap: 'nowrap', py: 2, px: 2 }}>    
            {Array.from({ length: 10 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  flexShrink: 0,
                  width: 60,
                  height: 60,
                  ml: index === 0 ? 0 : 1,
                  cursor: 'pointer',
                }}
                onClick={() => handleImageClick(index)}
              >
                {capturedImages[index] ? (
                  <img
                    src={capturedImages[index]}
                    alt={`Captured ${index}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      border: '1px solid #ccc',
                      borderRadius: 1,
                    }}
                  />
                )}
              </Box>
            ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" onClick={handleCapture}>
            撮影
          </Button>
        </Box>
    </Box>
  );
};

export default SellCamera;