import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Avatar, IconButton, Box, Typography, CircularProgress } from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CustomToolbar from '../components/common/CustumToolbar';
import LoadingComponent from '../components/common/LoadingComponent';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ProfileFormData {
  nickName: string | null;
  profileIcon: string | null; // URLを保持するためにstring型に変更
}

const MpProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

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
      const response = await axios.get('https://localhost:7103/api/Users/GetUserProfile', { withCredentials: true });
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profileIcon: URL.createObjectURL(file), // 一時的に表示するためのURLを生成
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    if (formData.nickName) {
      formDataToSend.append('nickName', formData.nickName);
    }
    if (fileInputRef.current?.files?.[0]) {
      formDataToSend.append('profileIcon', fileInputRef.current.files[0]);
    }

    try {
        setIsLoading(true);
      const response = await axios.put('https://localhost:7103/api/Users/UpdateProfile', formDataToSend, { withCredentials: true });

      if (response.status === 200) {
        // Profile updated successfully
        console.log('Profile updated');
        navigate('/mypage', { state: { snackOpen: true, snackMessage: 'プロフィールを更新しました。' } });
      } else {
        // Handle error
        console.error('Failed to update profile');
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

  return (
    <>
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
