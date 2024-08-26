import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Grid, Paper, Box, IconButton, Drawer, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareIcon from '@mui/icons-material/Share'; // 共有アイコン
import FlagIcon from '@mui/icons-material/Flag'; // 通報アイコン
import dayjs from 'dayjs';
import axios from 'axios';
import theme from '../../theme/theme';
import ReportDialog from '../common/ReportDialog';
import { Sell } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import { EmailShareButton, WhatsappShareButton, FacebookShareButton, TwitterShareButton, InstapaperShareButton, XIcon, FacebookIcon, LineIcon } from 'react-share';

interface MangaDetailInfoProps {
  title: string;
  numberOfBooks: number;
  bookState: string;
  sellTime: string;
  replyCount: number;
  isLiked: boolean;
  likeCount: number;
}

enum ReportType {
  Sell = 1,
  Reply = 2,
}

const MangaDetailInfo: React.FC<MangaDetailInfoProps> = ({
  title,
  numberOfBooks,
  bookState,
  sellTime,
  replyCount,
  isLiked,
  likeCount,
}) => {
  const formattedSellTime = dayjs(sellTime).format('YYYY年MM月DD日');
  const [liked, setLiked] = useState(isLiked);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [reportDialogOpen, setReportDialogOpen] = useState(false); // 通報ダイアログの状態
  const [drawerOpen, setDrawerOpen] = useState(false); // ドロワーの開閉状態
  const { authState } = useContext(AuthContext);
  const { sellId } = useParams();
  const navigate = useNavigate();
  const { refreshMyFavorite } = useContext(AppContext);

  const handleCommentNavigate = () => {
    navigate(`/item/${sellId}/comment`);
  }

  useEffect(() => {
    setLiked(isLiked !== undefined ? isLiked : false);
    setCurrentLikeCount(likeCount);
  }, [isLiked, likeCount]);

  const handleLike = async () => {
    try {
      const response = await axios.put(`https://localhost:7103/api/MyLists/${sellId}`, null, {
        withCredentials: true,
      });

      const updatedData = response.data;
      setLiked(updatedData.isLiked);
      setCurrentLikeCount(updatedData.likeCount);

      await refreshMyFavorite();
    } catch (error) {
      console.error('Error liking the item', error);
    }
  };

  const handleReportClick = () => {
    authState.isAuthenticated ? setReportDialogOpen(true) : navigate('/login-page');
  };

  const handleReportDialogClose = () => {
    setReportDialogOpen(false);
  };

  // 共有ボタンを押したときにドロワーを開く
  const handleShareClick = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Paper elevation={0} sx={{ pt: 1, pb: 1, pl: 2.0, pr: 1, border: 'none' }}>
      <Grid container spacing={0} alignItems="center" sx={{ pt: 1 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Grid>
      <Grid container spacing={0}>
        <Typography variant="h6" sx={{ color: '#B12704', py: 0.1 }}>
          全巻
          <Box component="span" sx={{ color: '#757575', pl: 1 }}>
            ({numberOfBooks}巻)
          </Box>
        </Typography>
      </Grid>
      <Typography variant="subtitle1" sx={{ pt: 2, pb: 0.5, color: '#156082' }}>
        {bookState}
      </Typography>
      
      {/* いいね、コメント、通報、共有 */}
      <Box sx={{ display: 'flex', justifyContent: 'left', pt: 1.5 }}>
        
        {/* いいねボタン */}
        <Box onClick={handleLike} sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center', borderColor: theme.palette.text.secondary, borderWidth: 1, borderStyle: 'solid', borderRadius: '5px', p: 0.1, mr: 1.5 }}>
          <IconButton sx={{ px: 0.6, py: 0.1, color: liked ? 'red' : 'default' }} disableRipple>
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant='subtitle2' sx={{ mr: 0.3, fontWeight: 'bold' }}>
            {(Number.isNaN(currentLikeCount) || currentLikeCount === 0) ? `いいね` : currentLikeCount}
          </Typography>
        </Box>

        {/* コメントボタン */}
        <Box onClick={handleCommentNavigate} sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', borderColor: theme.palette.text.secondary, borderWidth: 1, borderStyle: 'solid', borderRadius: '5px', p: 0.1, mr: 1.5 }}>
          <ModeCommentOutlinedIcon sx={{ fontSize: '19px', color: theme.palette.text.secondary, px: 0.6, py: 0.1 }} />
          <Typography variant='subtitle2' sx={{ mr: 0.3, fontWeight: 'bold' }}>
            {replyCount ? replyCount : 'コメント'}
          </Typography>
        </Box>

        {/* 共有ボタン */}
        <Box onClick={handleShareClick} sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', borderColor: theme.palette.text.secondary, borderWidth: 1, borderStyle: 'solid', borderRadius: '5px', p: 0.1, mr: 1.5 }}>
          <IconButton>
            <ShareIcon />
          </IconButton>
          <Typography variant='subtitle2' sx={{ mr: 0.3, fontWeight: 'bold' }}>
            共有
          </Typography>
        </Box>

        {/* 通報ボタン */}
        <Box onClick={handleReportClick} sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', borderColor: theme.palette.text.secondary, borderWidth: 1, borderStyle: 'solid', borderRadius: '5px', p: 0.8 }}>
          <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
            通報
          </Typography>
        </Box>
      </Box>

      {/* 共有用ドロワー */}
      <Drawer anchor='bottom' open={drawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant='h6'>共有</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 2 }}>
            <EmailShareButton url={window.location.href}>
              <Button variant="outlined">メールで共有</Button>
            </EmailShareButton>
            <InstapaperShareButton url={window.location.href}>
              <Button variant="outlined">Insta</Button>
            </InstapaperShareButton>
            <FacebookShareButton url={window.location.href}>
              <Button variant="outlined">Facebook</Button>
            </FacebookShareButton>
            <TwitterShareButton url={window.location.href}>
              <Button variant="outlined">Twitter</Button>
            </TwitterShareButton>
            <XIcon/>
          </Box>
        </Box>
      </Drawer>

      {/* 通報ダイアログ */}
      <ReportDialog
        id={Number(sellId)} // 出品のID
        reportType={ReportType.Sell} // 出品に対する通報
        open={reportDialogOpen} // ダイアログの開閉状態
        onClose={handleReportDialogClose} // ダイアログを閉じるハンドラ
      />
    </Paper>
  );
};

export default MangaDetailInfo;
