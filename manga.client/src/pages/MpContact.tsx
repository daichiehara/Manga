import React, { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Container, 
  Box, 
  CircularProgress
} from '@mui/material';
import { SnackbarContext } from '../components/context/SnackbarContext';
import { useCustomNavigate } from '../hooks/useCustomNavigate';
import CustomToolbar from '../components/common/CustumToolbar';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
    window.scrollTo({top:0, behavior: "instant"});
    const { control, handleSubmit, reset } = useForm<ContactFormData>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showSnackbar } = useContext(SnackbarContext);
    const customNavigate = useCustomNavigate();

  // Axiosインスタンスの作成
  const api = axios.create({
    withCredentials: true, // クッキーを含める
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await api.post('https://localhost:7103/api/Contacts', data);
      reset(); // フォームをリセット
      customNavigate();
      showSnackbar('お問い合わせが正常に送信されました。', 'success');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const description = `[${SERVICE_NAME}]お問い合わせフォームにて、お名前、メールアドレス、メッセージを入力してご送信ください。`;

  return (
    <HelmetProvider>
      <Helmet>
        <title>{SERVICE_NAME} - お問い合わせ</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${SERVICE_NAME} - お問い合わせ`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${SERVICE_NAME} - お問い合わせ`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
      </Helmet>

      <Container maxWidth="sm">
        <CustomToolbar title='お問い合わせ' />
        <Box pt={4} my={4}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: 'お名前は必須です' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="お名前"
                  error={!!error}
                  helperText={error?.message}
                  margin="normal"
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{ 
                required: 'メールアドレスは必須です', 
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: '有効なメールアドレスを入力してください'
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="メールアドレス"
                  type="email"
                  error={!!error}
                  helperText={error?.message}
                  margin="normal"
                />
              )}
            />
            <Controller
              name="message"
              control={control}
              defaultValue=""
              rules={{ required: 'メッセージは必須です' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="メッセージ"
                  multiline
                  rows={4}
                  error={!!error}
                  helperText={error?.message}
                  margin="normal"
                />
              )}
            />
            <Box mt={2}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isSubmitting}
                fullWidth
                size='large'
              >
                  {isSubmitting ? <CircularProgress size={24} /> : '送信'}
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </HelmetProvider>
  );
};

export default ContactForm;