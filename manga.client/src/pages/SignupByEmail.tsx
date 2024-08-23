import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import CustomTocaeruToolbar from '../components/common/CustomTocaeruToolBar';
import { updateGlobalAuthState } from '../components/context/AuthContext';
import theme from '../theme/theme';
import CheckModal from '../components/common/CheckModal';
import GooglePolicyText from '../components/common/GooglePolicyText';
import { useCustomNavigate } from '../hooks/useCustomNavigate';
import { SnackbarContext } from '../components/context/SnackbarContext';

const SignupByEmail: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const customNavigate = useCustomNavigate(2);
  const { showSnackbar } = useContext(SnackbarContext);

  const validatePassword = (password: string) => {
    if (/[！-～]/.test(password)) {
      return '全角文字を含めないでください';
    }
    if (password.length < 8) {
      return 'パスワードは8文字以上にしてください';
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return 'パスワードは小文字、大文字、数字を含めてください';
    }
    return null;
  };

  const handleSignup = async () => {
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('https://localhost:7103/api/Users/Register', {
        email,
        password,
        nickName,
      }, { withCredentials: true });

      setSuccess(response.data.Message);
      updateGlobalAuthState({ isAuthenticated: true });
      setLoading(false);
      
      customNavigate();
      showSnackbar('会員登録が完了しました。', 'success');

    } catch (err: any) {
      setError(err.response?.data?.Errors?.[0] || '登録に失敗しました');
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleOpenModal = () => {
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAgree = () => {
    setIsModalOpen(false);
    handleSignup();
  };

  return (
    <Box sx={{ px: '1rem' }}>
      <CustomTocaeruToolbar showSubtitle subtitle={'会員登録'} />
      <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box component="form" sx={{ mt: 1, width: '100%', maxWidth: 400 }}>
          <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: theme.palette.text.secondary, mb: 1 }}>
            メールアドレス
          </Typography>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="email"
            placeholder="tocaeru@email.com"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: theme.palette.text.secondary, mb: 1 }}>
            パスワード
          </Typography>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: theme.palette.text.secondary, mb: 1 }}>
            ニックネーム
          </Typography>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="nickName"
            placeholder="例 : トカエルくん"
            id="nickName"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            sx={{ mb: 2 }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleOpenModal}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : '登録'}
          </Button>
          <GooglePolicyText />
        </Box>
      </Box>
      <CheckModal
        open={isModalOpen}
        onClose={handleCloseModal}
        questionText="以下の内容で登録しますか？"
        agreeText="登録する"
        onAgree={handleAgree}
      >
        <Box
  sx={{
    marginTop: 2,
    padding: 2,
    borderRadius: 2,
    border: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
  }}
>
  <Typography variant='subtitle2' sx={{ marginBottom: 1,color: theme.palette.text.secondary }}>メールアドレス:</Typography>
  <Typography variant='body2' sx={{ marginBottom: 2 }}>{email}</Typography>
  <Typography variant='subtitle2' sx={{ marginBottom: 1 ,color: theme.palette.text.secondary}}>パスワード:</Typography>
  <Typography variant='body2' sx={{ marginBottom: 2 }}>{'•'.repeat(password.length)}</Typography>
  <Typography variant='subtitle2' sx={{ marginBottom: 1,color: theme.palette.text.secondary }}>ニックネーム:</Typography>
  <Typography variant='body2'>{nickName}</Typography>
</Box>
      </CheckModal>
    </Box>
  );
};

export default SignupByEmail;
