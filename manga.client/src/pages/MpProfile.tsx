import React, { useState, useRef, useEffect, useContext } from 'react';
import { TextField, Button, Avatar, IconButton, Box, Typography, CircularProgress } from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CustomToolbar from '../components/common/CustumToolbar';
import LoadingComponent from '../components/common/LoadingComponent';
import CircularProgressWithLabel from '../components/common/CircularProgressWithLabel';
import { useCustomNavigate } from '../hooks/useCustomNavigate';
import { SnackbarContext } from '../components/context/SnackbarContext';
import { UserContext } from '../components/context/UserContext';
import imageCompression from 'browser-image-compression';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';
import { API_BASE_URL } from '../apiName';

interface ProfileFormData {
  nickName: string | null;
  profileIcon: string | null; // URLを保持するためにstring型に変更
}

const MpProfile: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const customNavigate = useCustomNavigate();
  const { showSnackbar } = useContext(SnackbarContext);
  const { refreshUserInfo } = useContext(UserContext);
  const [processedImage, setProcessedImage] = useState<Blob | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    nickName: '',
    profileIcon: null,
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (uploadProgress >= 90 && uploadProgress < 100) {
      progressIntervalRef.current = setInterval(() => {
        setUploadProgress((prevProgress) => {
          if (prevProgress >= 99) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }
            return 100;
          }
          return prevProgress + 1;
        });
      }, 1000);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [uploadProgress]);

  const fetchUserProfile = async () => {
    try {
        setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/Users/GetUserProfile`, { withCredentials: true });
      const userProfile = response.data;
      setFormData({
        nickName: userProfile.nickName,
        profileIcon: userProfile.profileIcon, // URLをそのまま設定
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
        setLoading(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkWebPEncodingSupport = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      canvas.toBlob((blob) => {
        resolve(blob?.type === 'image/webp');
      }, 'image/webp');
    });
  };
  /*
  const resizeAndConvertImage = async (
    img: HTMLImageElement,
    maxSize: number,
    quality: number
  ): Promise<Blob> => {
    try {
      const isWebPEncodingSupported = await checkWebPEncodingSupport();
      if (isWebPEncodingSupported) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
      
        let size = Math.min(img.width, img.height);
        if (size > maxSize) {
          size = maxSize;
        }
      
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;
      
        canvas.width = size;
        canvas.height = size;
      
        ctx?.drawImage(
          img,
          startX, startY, size, size,
          0, 0, size, size
        );
      
        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            }
          }, 'image/webp', quality);
        });
      } else {
        const file = await fetch(img.src).then(r => r.blob()).then(blobFile => new File([blobFile], "image.jpg", { type: "image/jpeg" }));
        return imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: Math.max(img.width, img.height),
          useWebWorker: true,
          fileType: 'webp'
        });
      }
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
          const processedBlob = await resizeAndConvertImage(img, 2500, 0.75);
          setProcessedImage(processedBlob);
          setFormData((prevData) => ({
            ...prevData,
            profileIcon: URL.createObjectURL(processedBlob),
          }));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };
*/
const convertToWebP = async (
  file: File,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 1920
): Promise<File> => {
  const options = {
    maxSizeMB: maxSizeMB,
    maxWidthOrHeight: maxWidthOrHeight,
    useWebWorker: true,
    fileType: 'webp',
    quality: 0.8
  };

  try {
    console.log(`Original file size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);

    const compressedFile = await imageCompression(file, options);

    console.log(`Compressed WebP file size: ${(compressedFile.size / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Compression ratio: ${((1 - compressedFile.size / file.size) * 100).toFixed(2)}%`);

    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0] || null;
  if (file) {
    try {
      const webpFile = await convertToWebP(file);
      setProcessedImage(webpFile);
      setFormData((prevData) => ({
        ...prevData,
        profileIcon: URL.createObjectURL(webpFile),
      }));
    } catch (error) {
      console.error('WebP conversion failed:', error);
      showSnackbar('画像の変換に失敗しました。別の画像を試してください。', 'error');
    }
  }
};
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    if (formData.nickName) {
      formDataToSend.append('nickName', formData.nickName);
    }
    if (fileInputRef.current?.files?.[0] && processedImage) {
      formDataToSend.append('profileIcon', processedImage);
    }

    try {
      setIsUploading(true);
      const response = await axios.put(`${API_BASE_URL}/Users/UpdateProfile`, formDataToSend, {
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 90) / progressEvent.total!);
          setUploadProgress(Math.min(percentCompleted, 90));
        },
      });

      if (response.status === 200) {
        await refreshUserInfo();
        customNavigate();
        showSnackbar('正常に更新されました。', 'success');
      } else {
        // Handle error
        console.error('Failed to update profile');
        showSnackbar('更新に失敗しました。', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000); // Delay hiding the progress for 1 second after completion
    }
  };

  const handleChangeImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (isLoading) {
    return (
      <>
        <CustomToolbar title='プロフィール設定' />
        <LoadingComponent />
      </>
    );
  }

  const description = `[${SERVICE_NAME}]プロフィール設定ページです。`;
  
  return (
    <>
      <Helmet>
        <title>プロフィール設定 - {SERVICE_NAME}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`プロフィール設定 - ${SERVICE_NAME}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:title" content={`プロフィール設定 - ${SERVICE_NAME}`} />
        <meta name="twitter:description" content={description} />
      </Helmet>
      <CustomToolbar title="プロフィール設定" />
      <Box sx={{ px: 2, pt: '5rem' }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="body2" fontWeight="bold">
            プロフィール画像
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton component="label">
              <Avatar
                src={formData.profileIcon || ''}
                sx={{ width: 72, height: 72 }}
              />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<PhotoLibraryIcon />}
              sx={{ ml: 1 }}
              onClick={handleChangeImageClick}
            >
              画像を変更する
            </Button>
          </Box>
          <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
            ニックネーム
          </Typography>
          <TextField
            name="nickName"
            value={formData.nickName}
            placeholder="ニックネーム (例: トカエルくん)"
            fullWidth
            onChange={handleInputChange}
            sx={{ mb: 4 }}
            InputLabelProps={{
              shrink: false,
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth size='large' disabled={isLoading}>
            更新する
          </Button>
          {isUploading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgressWithLabel value={uploadProgress} open={isUploading} size={55} />
            </Box>
          )}
        </form>
      </Box>
    </>
  );
};

export default MpProfile;
