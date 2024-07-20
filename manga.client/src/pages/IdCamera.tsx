import React, { useState, useRef, useEffect, useContext } from 'react';
import { Box, Button, useTheme, useMediaQuery, Typography, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomToolbar from '../components/common/CustumToolbar';
import { Check } from '@mui/icons-material';
import axios from 'axios';
import CameraVideoComponent from '../components/common/CameraVideo';
import ImageShow from '../components/common/ImageShow';
import CameraButton from '../components/common/CameraButton';
import { useCustomNavigate } from '../hooks/useCustomNavigate';
import { SnackbarContext } from '../components/context/SnackbarContext';
import { UserContext } from '../components/context/UserContext';

const CameraPage: React.FC = () => {
  window.scrollTo({top:0, behavior: "instant"});

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const theme = useTheme();
  const notLgMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const customNavigate = useCustomNavigate();
  const { showSnackbar } = useContext(SnackbarContext);
  const { refreshUserInfo } = useContext(UserContext);
  
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleStartCamera = () => {
    handleClose();
    startCamera();
  };
  
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
            showSnackbar('撮影を開始するにはカメラのアクセスを許可する必要があります。。', 'error');
            // 前の画面に戻る
            customNavigate();
          } else if (error.name === 'PermissionDeniedError') {
            // PermissionDeniedErrorの場合の処理
            showSnackbar('カメラのアクセスが拒否されました。ブラウザの設定でカメラのアクセスを許可してください。', 'error');
            // 前の画面に戻る
            customNavigate();
          } else {
            // その他のエラーの場合の処理
            showSnackbar('カメラへのアクセスエラーが発生しました。', 'error');
            // 前の画面に戻る
            customNavigate();
          }
        } else {
          // error が Error 型でない場合の処理
          showSnackbar('カメラへのアクセスエラーが発生しました。', 'error');
          // 前の画面に戻る
          customNavigate();
        }
      }
  };
  
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

  const handleAlbumClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
  

    const handleCapture = () => {
        if (videoRef.current) {
          const videoWidth = videoRef.current.videoWidth;
          const videoHeight = videoRef.current.videoHeight;
          const aspectRatio = videoWidth / videoHeight;
      
          let canvasWidth = notLgMobile ? 640 : 430;
          let canvasHeight = canvasWidth;
      
          if (aspectRatio > 1) {
            canvasWidth = canvasHeight * aspectRatio;
          } else {
            canvasHeight = canvasWidth / aspectRatio;
          }
      
          const canvas = document.createElement('canvas');
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
      
          const context = canvas.getContext('2d');
          if (context) {
            context.drawImage(videoRef.current, 0, 0, canvasWidth, canvasHeight);
      
            const croppedCanvas = document.createElement('canvas');
            croppedCanvas.width = notLgMobile ? 640 : 430;
            croppedCanvas.height = notLgMobile ? 640 : 430;
      
            const croppedContext = croppedCanvas.getContext('2d');
            if (croppedContext) {
              const sourceX = (canvasWidth - croppedCanvas.width) / 2;
              const sourceY = (canvasHeight - croppedCanvas.height) / 2;
              croppedContext.drawImage(canvas, sourceX, sourceY, croppedCanvas.width, croppedCanvas.height, 0, 0, croppedCanvas.width, croppedCanvas.height);
      
              const capturedImage = croppedCanvas.toDataURL('image/png');
              setCapturedImage(capturedImage);
            }
          }
        }
        stopCamera();
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
          await refreshUserInfo();
            // アップロード成功後の処理を追加
            customNavigate();
            showSnackbar('アップロード完了', 'success');
            navigate('/main-page');
        } else {
            console.error('Failed to upload image');
            // アップロード失敗時の処理を追加
            showSnackbar('アップロードに失敗しました。時間をおいて再度試してください。', 'error');
            // 前の画面に戻る
            customNavigate();
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        // エラー処理を追加
        showSnackbar('予期せぬエラーが起こりました。時間をおいて再度試してください。', 'error');
        // 前の画面に戻る
        customNavigate();
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <>
        <Dialog open={open} onClose={handleClose} disableScrollLock>
            <DialogTitle>カメラのアクセス許可</DialogTitle>
            <DialogContent>
                本人確認画像を撮影するには、次の画面でカメラのアクセスを許可する必要があります。
            </DialogContent>
            <DialogActions>
            <Button onClick={handleStartCamera} color="primary">
                了解
            </Button>
            </DialogActions>
        </Dialog>


        <CustomToolbar title="本人確認 - 撮影" />
      
        {capturedImage ? (
          <>
            <Box px={2} pb={2}>
                <Box sx={{ pt: { xs: '4.5rem', sm: '5rem' }, mb: 2 }}>
                    <Typography variant='h6' textAlign={'center'} mb={1}>撮影画像の確認</Typography>
                    <Grid container alignItems="center" mb={2}>
                        <Grid item xs={5.5} bgcolor={'#d9d9d9'} p={1} borderRadius={2} mr={'auto'}>
                            <img
                                src="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/CardOk.png"
                                alt="Id Verification OK"
                                style={{ maxWidth: '100%' }}
                            />
                            <Typography variant='body2' fontWeight={'bold'} textAlign={'center'}>鮮明に写っている</Typography>
                        </Grid>
                        <Grid item xs={5.5} bgcolor={'#d9d9d9'} p={1} borderRadius={2} ml={'auto'}>
                            <img
                                src="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/CardBad.png"
                                alt="Id Verification NG"
                                style={{ maxWidth: '100%' }}
                            />
                            <Typography variant='body2' fontWeight={'bold'} textAlign={'center'}>ぼやけている</Typography>
                        </Grid>
                    </Grid>
                </Box>
                
                <ImageShow selectedImage={capturedImage} mt={false} />
                <Typography variant='body2' color={'error'} mt={2} textAlign={'center'}>すべての項目が隠れずに鮮明に写っていますか？</Typography>
                <Box display="flex" justifyContent="space-around" mt={2}> 
                <Button
                    variant="outlined"
                    color="primary"
                    size='large'
                    onClick={handleRetake}
                    sx={{
                    '&.MuiButton-outlined': {
                        borderWidth: '2px',
                    },
                    }}
                >
                    再撮影
                </Button>
                    <Button variant="contained" color="primary" size='large' startIcon={<Check />} onClick={handleUpload}>
                        確認して送信
                    </Button>
                </Box>
            </Box>
        </>
      ) : (
        <>
            <CameraVideoComponent showFrame={true} videoRef={videoRef} />
            <CameraButton onCameraClick={handleCapture} onAlbumClick={handleAlbumClick} showAlbumIcon={false} />
        </>
        )}
      
    </>
  );
};

export default CameraPage;