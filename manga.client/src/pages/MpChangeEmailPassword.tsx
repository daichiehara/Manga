import React, { useState, useEffect, useContext } from 'react';
import { Typography, TextField, Button, Grid, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import CustomToolbar from '../components/common/CustumToolbar';
import { useCustomNavigate } from '../hooks/useCustomNavigate';
import { SnackbarContext } from '../components/context/SnackbarContext';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';
import { BASE_URL, API_BASE_URL } from '../apiName';

type FormData = {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};


const MpChangeEmailPassword: React.FC = () => {
  
  window.scrollTo({top:0, behavior: "instant"});
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
  const customNavigate = useCustomNavigate();
  const { showSnackbar } = useContext(SnackbarContext);


  useEffect(() => {
    const fetchCurrentEmail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/manage/info`, {
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
      const response = await axios.post(`${API_BASE_URL}/Users/UpdateAccount`, {  
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
        customNavigate();
        showSnackbar('正常に更新されました。', 'success');
      } else {
        // Handle error
        console.error('Failed to update account');
        showSnackbar('更新に失敗しました。', 'error');
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

  const description = `[${SERVICE_NAME}]メールアドレスおよびパスワードの更新を行います。`;
  
  return (
    <HelmetProvider>
      <Helmet>
        <title>{SERVICE_NAME} - メール・パスワードの変更</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${SERVICE_NAME} - メール・パスワードの変更`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${SERVICE_NAME} - メール・パスワードの変更`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
      </Helmet>

      {/* CustomToolbarはそのままにする */}
      <CustomToolbar title='メール・パスワード' />
      <Box pt={9} px={2}>
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
                    type="password"
                    fullWidth
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
                    type="password"
                    fullWidth
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
                    type="password"
                    fullWidth
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
          <Button type="submit" variant="contained" color="primary" size='large' fullWidth disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : '更新する'}
          </Button>
        </form>
      </Box>
    </HelmetProvider>
  );
};

export default MpChangeEmailPassword;
