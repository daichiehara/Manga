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

  

  return (
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
  );
};

export default ContactForm;