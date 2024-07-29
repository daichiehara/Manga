import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import CustomTocaeruToolbar from '../components/common/CustomTocaeruToolBar';
import theme from '../theme/theme';

const SignupByEmail: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('https://localhost:7103/api/Users/Register', {
        email,
        password,
        nickName,
      }, {withCredentials:true});

      setSuccess(response.data.Message);
      setLoading(false);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.Errors?.[0] || '登録に失敗しました');
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
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
            placeholder="例 : トカエル君"
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
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : '登録'}
          </Button>
          <Typography variant='body2' sx={{color: theme.palette.text.secondary}}>
            このサイトはreCAPTCHAで保護されており、Googleのプライバシーポリシーと利用規約が適用されます。
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignupByEmail;
