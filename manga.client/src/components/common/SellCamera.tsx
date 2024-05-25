import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import CameraVideoComponent from './CameraVideo';
import ImageShow from './ImageShow';
import CameraButton from './CameraButton';
import { useNavigate } from 'react-router-dom';

const SellCamera: React.FC = () => {
  window.scrollTo({top:0, behavior: "instant"});
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const navigate = useNavigate();
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const stopCamera = () => {
    console.log('Attempting to stop camera. Current videoRef:', videoRef.current);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      console.log('Tracks to stop:', tracks.length);
      tracks.forEach(track => {
        track.stop();
        console.log('Track stopped:', track);
      });
      videoRef.current.srcObject = null;
    } else {
      console.log('No video or stream found.');
    }
  };
  
  useEffect(() => {
    return () => {
      if (videoStream) {
        console.log("Stopping camera");
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);  // videoStreamを依存配列に追加

  const handleAlbumClick = () => {
    console.log('open const handleAlbumClick');
    if (fileInputRef.current) {
      console.log('select file');
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setCapturedImages(prevImages => [...prevImages, imageUrl]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

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
    <Box sx={{pb: '7rem'}}>
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
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        <CameraButton onCameraClick={handleCapture} onAlbumClick={handleAlbumClick} />
    </Box>
  );
};

export default SellCamera;