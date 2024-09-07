import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Grid, Paper, Box, IconButton, Drawer, Tooltip, Divider } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareIcon from '@mui/icons-material/Share'; // 共有アイコン
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import dayjs from 'dayjs';
import axios from 'axios';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import theme from '../../theme/theme';
import ReportDialog from '../common/ReportDialog';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, LineShareButton, LineIcon, XIcon } from 'react-share';
import { API_BASE_URL } from '../../apiName';
import { SnackbarContext } from '../context/SnackbarContext';

interface MangaDetailInfoProps {
  title: string;
  numberOfBooks: number;
  bookState: string;
  sellTime: string;
  replyCount: number;
  isLiked: boolean;
  likeCount: number;
  imageUrl: string;  // 画像URL
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
  imageUrl,  // 画像URLの追加
}) => {
  const formattedSellTime = dayjs(sellTime).format('YYYY年MM月DD日');
  const [liked, setLiked] = useState(isLiked);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { authState } = useContext(AuthContext);
  const { sellId } = useParams();
  const navigate = useNavigate();
  const { refreshMyFavorite } = useContext(AppContext);
  const { showSnackbar } = useContext(SnackbarContext);

  const handleCommentNavigate = () => {
    navigate(`/item/${sellId}/comment`);
  };

  useEffect(() => {
    setLiked(isLiked !== undefined ? isLiked : false);
    setCurrentLikeCount(likeCount);
  }, [isLiked, likeCount]);

  const handleLike = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/MyLists/${sellId}`, null, {
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
    authState.isAuthenticated ? setReportDialogOpen(true) : navigate('/signup');
  };

  const handleReportDialogClose = () => {
    setReportDialogOpen(false);
  };

  const handleShareClick = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const copyToClipboard = () => {
    const textToCopy = `${window.location.href}\n${description}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      //alert('リンクと説明文をコピーしました');
      handleDrawerClose();
      showSnackbar('リンクと説明文をコピーしました', 'success');
    }).catch(err => {
      //console.error('コピーに失敗しました', err);
      handleDrawerClose();
      showSnackbar('コピーに失敗しました', 'error');
    });
  };
  

  // メタタグで使用する説明文を生成
  const description = `[トカエル]${title}: 全${numberOfBooks}巻  無料で漫画がよめるかも！？物々交換してみよう！！`;

  return (
    <HelmetProvider>
      <Paper elevation={0} sx={{ pt: 1, pb: 1, pl: 2.0, pr: 1, border: 'none' }}>
        {/* Helmetによるメタタグ設定 */}
        

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
        <Drawer anchor='bottom' 
        open={drawerOpen} 
        onClose={handleDrawerClose} 
        sx={{
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            height: '30vh',
            maxWidth: '640px',
            mx: 'auto',
            zIndex: 30000,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            paddingTop: 0,
          }
        }}
      >
        <Box sx={{mt:'20px', textAlign: 'center', width: '100%' }}>
          <Typography variant='subtitle1' sx={{fontWeight:'bold'}}>この出品を共有する</Typography>
          <Divider variant='middle' sx={{ mt: 1, mb: 2 }} />

          {/* アイコンボタンエリア */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', ml: 2 }}>
            
            {/* リンクをコピー */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: '12px' }}>
              <IconButton onClick={copyToClipboard} sx={{pb:2}}>
                <ContentCopyIcon sx={{ fontSize: '33px' }} />
              </IconButton>
              <Typography variant="caption">リンクをコピー</Typography>
            </Box>

            {/* X (Twitter Share) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: `30px` }}>
              <TwitterShareButton 
                url={window.location.href}
                title={description}
              >
                <XIcon round size={50} />
              </TwitterShareButton>
              <Typography variant="caption">X</Typography>
            </Box>

            {/* LINE Share */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <LineShareButton 
                url={window.location.href}
                title={description}
              >
                <LineIcon round size={50} />
              </LineShareButton>
              <Typography variant="caption">LINE</Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>


        {/* 通報ダイアログ */}
        <ReportDialog
          id={Number(sellId)} 
          reportType={ReportType.Sell} 
          open={reportDialogOpen} 
          onClose={handleReportDialogClose} 
        />
      </Paper>
    </HelmetProvider>
  );
};

export default MangaDetailInfo;