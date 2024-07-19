import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Grid, Paper, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import dayjs from 'dayjs';
import axios from 'axios';

interface MangaDetailInfoProps {
  title: string;
  numberOfBooks: number;
  bookState: string;
  sellTime: string;
  replyCount: number;
  isLiked: boolean;
  likeCount: number;
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
      <Typography variant="subtitle1" sx={{ pt: 0.5, pb: 0, color: '#757575' }}>
        {`${formattedSellTime}に出品`}
      </Typography>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'left' }}>
          <IconButton onClick={handleLike} sx={{ color: liked ? 'red' : 'default' }} disableRipple>
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography sx={{ pl: 1, pt: 1 }}>
            {Number.isNaN(currentLikeCount) ? `いいね！` : currentLikeCount}
          </Typography>
          <ModeCommentOutlinedIcon sx={{ color: 'default', pl: 2, pt: 1 }} />
          <Typography sx={{ pl: 1, pt: 1 }}>
            {replyCount ? replyCount : 'コメント'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default MangaDetailInfo;
