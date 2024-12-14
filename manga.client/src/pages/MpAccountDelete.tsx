import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TextField,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { updateGlobalAuthState } from '../components/context/AuthContext';
import { SnackbarContext } from '../components/context/SnackbarContext';
import CustomToolbar from '../components/common/CustumToolbar';
import axios from 'axios';
import { API_BASE_URL } from '../apiName';

interface DeleteAccountResponse {
  message: string;
}

const MpAccountDelete: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { showSnackbar } = useContext(SnackbarContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setError(null);
    setConfirmText('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError(null);
    setConfirmText('');
  };

  const clearAuthCookies = () => {
    const cookieOptions = "expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=None; Secure";
    document.cookie = `accessToken=; ${cookieOptions}`;
    document.cookie = `RefreshToken=; ${cookieOptions}`;
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== '削除します') {
      setError('確認のテキストが正しくありません');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      await axios.delete<DeleteAccountResponse>(`${API_BASE_URL}/Users/delete`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      // 削除が成功した場合のみここが実行される
      updateGlobalAuthState({ isAuthenticated: false });
      clearAuthCookies();
      navigate('/', { replace: true });
      showSnackbar('アカウントが正常に削除されました', 'success');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || '予期せぬエラーが発生しました');
      } else {
        setError('予期せぬエラーが発生しました');
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <CustomToolbar title='アカウント設定' />
      <Box sx={{pt: 11, mx: 2}}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h1" gutterBottom color="error" sx={{fontWeight: 'bold'}}>
              アカウントの削除
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              アカウントを削除すると、以下のデータが完全に削除され、復元することはできません
            </Typography>

            <Box component="ul" sx={{ mb: 3 }}>
              <Typography component="li">プロフィール情報</Typography>
              <Typography component="li">出品した商品情報</Typography>
              <Typography component="li">取引履歴</Typography>
              <Typography component="li">ほしい漫画リスト</Typography>
              <Typography component="li">アップロードした画像</Typography>
            </Box>

            <Button
              variant="contained"
              color="error"
              onClick={handleOpenDialog}
              fullWidth
            >
              アカウントを削除する
            </Button>
          </CardContent>
        </Card>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            アカウント削除の確認
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              この操作は取り消すことができません。本当にアカウントを削除しますか？
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 1 }}>
              確認のため「削除します」と入力してください：
            </Typography>
            
            <TextField
              fullWidth
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              error={!!error}
              disabled={isLoading}
              sx={{ mb: 2 }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleDeleteAccount}
              color="error"
              disabled={isLoading || confirmText !== '削除します'}
            >
              {isLoading ? <CircularProgress size={24} /> : '削除する'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default MpAccountDelete;