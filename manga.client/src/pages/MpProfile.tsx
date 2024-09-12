import React, { useState, useRef, useEffect, useContext } from 'react';
import { TextField, Button, Avatar, IconButton, Box, Typography, CircularProgress } from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CustomToolbar from '../components/common/CustumToolbar';
import LoadingComponent from '../components/common/LoadingComponent';
import { useCustomNavigate } from '../hooks/useCustomNavigate';
import { SnackbarContext } from '../components/context/SnackbarContext';
import { UserContext } from '../components/context/UserContext';
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

  const [formData, setFormData] = useState<ProfileFormData>({
    nickName: '',
    profileIcon: null,
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

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

  const resizeAndConvertToWebP = (
    img: HTMLImageElement,
    maxSize: number
  ): Promise<Blob> => {
    return new Promise((resolve) => {
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

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, 'image/webp');
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
          const processedBlob = await resizeAndConvertToWebP(img, 2500);
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
        setIsLoading(true);
      const response = await axios.put(`${API_BASE_URL}/Users/UpdateProfile`, formDataToSend, { withCredentials: true });

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
        setIsLoading(false);
    }
  };

  const handleChangeImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
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
      {loading && <LoadingComponent />}
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
          {isLoading ? <CircularProgress size={24} /> : '更新する'}
          </Button>
        </form>
      </Box>
    </>
  );
};

export default MpProfile;
