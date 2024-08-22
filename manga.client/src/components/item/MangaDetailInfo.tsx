import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Grid, Paper, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import FlagIcon from '@mui/icons-material/Flag'; // 通報アイコン
import dayjs from 'dayjs';
import axios from 'axios';
import theme from '../../theme/theme';
import ReportDialog from '../common/ReportDialog';
import { Sell } from '@mui/icons-material';

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
  const { sellId } = useParams();

  useEffect(() => {
    // 初期値を設定
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
    } catch (error) {
      console.error('Error liking the item', error);
    }
  };

  const handleReportClick = () => {
    setReportDialogOpen(true); // 通報ダイアログを開く
  };

  const handleReportDialogClose = () => {
    setReportDialogOpen(false); // 通報ダイアログを閉じる
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
      
      {/* いいね、コメント、通報 */}
      <Box sx={{ display: 'flex', justifyContent: 'left', pt: 1.5 }}>
        <Typography variant="subtitle1" sx={{ mr: 1.0, pt: 0.5, pb: 0, color: '#757575' }}>
          {`${formattedSellTime}に出品`}
        </Typography>
        
        {/* いいねボタン */}
        <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center', borderColor: theme.palette.text.secondary, borderWidth: 1, borderStyle: 'solid', borderRadius: '5px', p: 0.1, mr: 0.7 }}>
          <IconButton onClick={handleLike} sx={{ px: 0.3, py: 0.3, color: liked ? 'red' : 'default' }} disableRipple>
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant='subtitle2' sx={{ mr: 0.3, fontWeight: 'bold' }}>
            {(Number.isNaN(currentLikeCount) || currentLikeCount === 0) ? `いいね` : currentLikeCount}
          </Typography>
        </Box>

        {/* コメントボタン */}
        <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', borderColor: theme.palette.text.secondary, borderWidth: 1, borderStyle: 'solid', borderRadius: '5px', p: 0.1, mr: 0.7 }}>
          <ModeCommentOutlinedIcon sx={{ fontSize: '19px', color: theme.palette.text.secondary, px: 0.3, py: 0.3 }} />
          <Typography variant='subtitle2' sx={{ mr: 0.3, fontWeight: 'bold' }}>
            {replyCount ? replyCount : 'コメント'}
          </Typography>
        </Box>

        {/* 通報ボタン */}
        <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', borderColor: theme.palette.text.secondary, borderWidth: 1, borderStyle: 'solid', borderRadius: '5px', p: 0.1 }}>
          <IconButton onClick={handleReportClick} sx={{ px: 0.3, py: 0.3, color: 'default' }} disableRipple>
            <FlagIcon />
          </IconButton>
          <Typography variant='subtitle2' sx={{ mr: 0.3, fontWeight: 'bold' }}>
            通報
          </Typography>
        </Box>
      </Box>

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
