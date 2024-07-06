import React, { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SnackbarContext } from '../components/context/SnackbarContext';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const { control, handleSubmit, reset } = useForm<ContactFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useContext(SnackbarContext);

  // Axiosインスタンスの作成
  const api = axios.create({
    withCredentials: true, // クッキーを含める
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await api.post('https://localhost:7103/api/Contacts', data);
      reset(); // フォームをリセット
      navigate(-1);
      showSnackbar('お問い合わせが正常に送信されました。', 'success');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          お問い合わせ
        </Typography>
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
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? '送信中...' : '送信'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ContactForm;