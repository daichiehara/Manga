import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Card,
  CardContent,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../apiName';
import MangaListItem from '../components/item/MangaListItem';
import CustomToolbar from '../components/common/CustumToolbar';
import VerificationStatus from '../components/common/VerificationStatus';
import { SnackbarContext } from '../components/context/SnackbarContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BlockIcon from '@mui/icons-material/Block';

interface ProfileData {
  userId: string;
  nickName: string;
  profileIcon: string;
  hasIdVerification: boolean;
  isBlocked: boolean;
  sellList: {
    sellId: number;
    sellTitle: string;
    numberOfBooks: number;
    sellStatus: number;
    wishTitles: { title: string; isOwned: boolean }[];
    sellImage: string;
  }[];
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { showSnackbar } = useContext(SnackbarContext);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBlockClick = () => {
    setBlockDialogOpen(true);
    handleMenuClose();
  };

  const handleBlockConfirm = async () => {
    setProcessing(true);
    try {
      if (profile?.isBlocked) {
        await axios.delete(`${API_BASE_URL}/BlockedUsers/${userId}`, {
          withCredentials: true
        });
        showSnackbar('ブロックを解除しました', 'success');
      } else {
        await axios.post(`${API_BASE_URL}/BlockedUsers/${userId}`, {}, {
          withCredentials: true
        });
        showSnackbar('ブロックしました', 'success');
      }
  
      const response = await axios.get<ProfileData>(
        `${API_BASE_URL}/Users/profile/${userId}`,
        { withCredentials: true }
      );
      setProfile(response.data);
      setBlockDialogOpen(false);
  
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'ブロック処理に失敗しました');
      } else {
        setError('予期せぬエラーが発生しました');
      }
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<ProfileData>(
          `${API_BASE_URL}/Users/profile/${userId}`,
          { withCredentials: true }
        );
        setProfile(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || '予期せぬエラーが発生しました');
        } else {
          setError('予期せぬエラーが発生しました');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error || 'プロフィールの読み込みに失敗しました'}</Alert>
      </Box>
    );
  }

  return (
    <>
      <CustomToolbar title="プロフィール" />
      <Box sx={{ pt: 11, pb: 2 }}>
        <Container maxWidth="md">
          <Card sx={{ mb: 4, position: 'relative' }}>
            {/* メニューボタン */}
            <IconButton
              sx={{ position: 'absolute', top: 8, right: 8 }}
              onClick={handleMenuClick}
            >
              <MoreVertIcon />
            </IconButton>
            
            {/* メニュー */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              disableScrollLock
            >
              <MenuItem 
                onClick={handleBlockClick}
                sx={{
                  color: profile?.isBlocked ? 'text.primary' : 'error.main',
                  gap: 1
                }}
              >
                <BlockIcon fontSize="small" />
                {profile?.isBlocked ? 'ブロック解除' : 'ブロックする'}
              </MenuItem>
            </Menu>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar
                    src={profile.profileIcon}
                    alt={profile.nickName}
                    sx={{ width: 80, height: 80 }}
                  />
                </Grid>
                <Grid item xs>
                  <Typography variant="h6" component="h1">
                    {profile.nickName}
                  </Typography>
                  <VerificationStatus isVerified={profile.hasIdVerification} />
                  {profile.isBlocked && (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main', mt: 0.5 }}>
                      <BlockIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        ブロック中のユーザーです
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* ブロック確認ダイアログ */}
          <Dialog
            open={blockDialogOpen}
            onClose={() => setBlockDialogOpen(false)}
          >
            <DialogTitle>
              {profile?.isBlocked ? 'ブロック解除の確認' : 'ブロックの確認'}
            </DialogTitle>
            <DialogContent>
              <Typography>
                {profile?.isBlocked 
                  ? `${profile.nickName}さんのブロックを解除しますか？`
                  : `${profile.nickName}さんをブロックしますか？\nブロックすると、このユーザーとの取引やメッセージのやり取りができなくなります。`
                }
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setBlockDialogOpen(false)}
                disabled={processing}
              >
                キャンセル
              </Button>
              <Button 
                onClick={handleBlockConfirm}
                color={profile?.isBlocked ? 'primary' : 'error'}
                variant="contained"
                disabled={processing}
              >
                {processing ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  profile?.isBlocked ? 'ブロック解除' : 'ブロックする'
                )}
              </Button>
            </DialogActions>
          </Dialog>

          <Typography variant="h6" component="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
            このユーザーの出品
          </Typography>

          {profile.sellList.length > 0 ? (
            <Grid container spacing={0}>
              {profile.sellList.map((sell) => (
                <Grid item xs={12} key={sell.sellId}>
                  <MangaListItem
                    sellId={sell.sellId}
                    sellImage={sell.sellImage}
                    sellTitle={sell.sellTitle}
                    numberOfBooks={sell.numberOfBooks}
                    wishTitles={sell.wishTitles}
                    sellStatus={sell.sellStatus}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="textSecondary" align="center">
              出品はまだありません
            </Typography>
          )}
        </Container>
      </Box>
    </>
  );
};

export default UserProfile;