import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Grid, CircularProgress, Box, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import CustomToolbar from '../components/common/CustumToolbar';

type FormData = {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};


const MpChangeEmailPassword: React.FC = () => {
  
  const [currentEmail, setCurrentEmail] = useState('');
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      email: currentEmail,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMismatchError, setPasswordMismatchError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [serverError, setServerError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentEmail = async () => {
      try {
        const response = await axios.get('https://localhost:7103/manage/info', {
          withCredentials: true,
        });
        setCurrentEmail(response.data.email);
        reset({ email: response.data.email });
      } catch (error) {
        console.error('Failed to fetch current email:', error);
      }
    };
  
    fetchCurrentEmail();
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    
    setPasswordMismatchError('');
    setPasswordErrors([]);
    setServerError('');

    const isPasswordChange =
    data.currentPassword !== '' || data.newPassword !== '' || data.confirmPassword !== '';

  if (isPasswordChange) {
    const errors: string[] = [];

    if (data.newPassword !== data.confirmPassword) {
      errors.push('新しいパスワードと新しいパスワード(確認)が一致していません。');
    }

    if (data.newPassword.length < 8) {
      errors.push('パスワードは最低でも 8 文字必要です。');
    }

    if (!/\d/.test(data.newPassword)) {
      errors.push('パスワードには少なくとも1つの数字 (0~9) が必要です。');
    }

    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }
  }

    setIsLoading(true);

    console.log('Submitting form:', data);

    try {
      console.log('Sending API request...');
      const response = await axios.post('https://localhost:7103/api/Users/UpdateAccount', {  
      newEmail: data.email,
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        withCredentials: true,
      });
      console.log('API response:', response);

      if (response.status === 200) {
        // Handle success
        console.log('更新されました。');
        navigate(-1);
      } else {
        // Handle error
        console.error('Failed to update account');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('An error occurred while updating account:', error);
        if (error.response) {
          if(error.response.status === 400){
            const errorMessage = error.response.data;
            const colonIndex = errorMessage.indexOf(':');
            if (colonIndex !== -1) {
              setServerError(errorMessage.slice(colonIndex + 1).trim());
            } else {
              setServerError(errorMessage);
            }
          }else if (error.response.status === 500) {
            setServerError('メールアドレスが正しくない可能性があります。正しい状態でエラーになる場合はお手数ですがお問合せをしてください。');
          }
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          console.error('Request:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      } else {
        console.error('An unknown error occurred:', error);
      }
    }

    setIsLoading(false);
  };
  
  return (
    <>
      {/* CustomToolbarはそのままにする */}
      <CustomToolbar title='メール・パスワード' />
      <Box mt={8} px={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="メールアドレス"
                    type="email"
                    fullWidth
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" mb={2}>
                メールアドレスを変更すると確認メールが送信されます。メール内のURLをクリックすると変更が完了します。
              </Typography>
              <hr />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="currentPassword"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="現在のパスワード"
                    type={showCurrentPassword ? 'text' : 'password'}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                            {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="newPassword"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="新しいパスワード"
                    type={showNewPassword ? 'text' : 'password'}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} mb={1}>
              <Controller
                name="confirmPassword"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="新しいパスワード(確認)"
                    type={showConfirmPassword ? 'text' : 'password'}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            {passwordMismatchError && (
              <Typography variant='body2' color="error" px={2}>
                {passwordMismatchError}
              </Typography>
            )}
            {passwordErrors.map((error, index) => (
              <Typography variant='body2' key={index} color="error" px={2} mb={1}>
                {error}
              </Typography>
            ))}
            <Grid item xs={12} mb={2}>
              <Typography variant="body2" color="textSecondary">
                パスワードを設定したい場合は上記をすべて入力してください。
              </Typography>
            </Grid>
          </Grid>

          {serverError && (
            <Typography variant='body2' color="error" mx={2} mb={2}>
              {serverError}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{my:1, background: 'linear-gradient(to right, #FCCF31, #F55555)'}} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} sx={{color:'white'}}/> : '更新する'}
          </Button>
        </form>
      </Box>
    </>
  );
};

export default MpChangeEmailPassword;
