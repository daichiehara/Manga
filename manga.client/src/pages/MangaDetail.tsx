import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Grid, Avatar, Stack } from '@mui/material';
import Chip from '@mui/material/Chip';
import dayjs from 'dayjs';
import 'swiper/swiper-bundle.css'; 
import SwiperClass from 'swiper';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BeenhereRoundedIcon from '@mui/icons-material/BeenhereRounded';
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined'; 
import ImageCarousel from '../components/common/ImageCarousel';
import BackButton from '../components/common/BackButton';
import MangaDetailInfo from '../components/item/MangaDetailInfo';

/**
 * MangaDetail コンポーネント
 * 
 * 漫画の詳細情報を表示するコンポーネント。
 * URLパラメータから漫画の出品IDを取得し、サーバーからその出品IDに対応する漫画の詳細情報を取得する。
 * 取得した詳細情報をMaterial-UIコンポーネントを使って表示する。
 * 
 * Props:
 *  None
 */

interface MangaDetail {
    title: string;
    numberOfBooks: number;
    bookState: string;
    sellTime: string;
    imageUrls: string[];
    profileIcon: string;
    userName: string;
    sellMessage: string;
    wishTitles: { title: string }[];
    sendPrefecture: string;
    sendDay: string;
    hasIdVerificationImage: boolean;
  }  

const MangaDetail = () => {
  const { sellId } = useParams();
  const [mangaDetail, setMangaDetail] = useState<MangaDetail | null>(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 前のページに戻る
  };

  console.log(sellId);

  // Swiperのインスタンスを保持するためのref
  const swiperRef = useRef<SwiperClass>(null);
  // 現在のスライドインデックスを保持するための状態変数
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (swiper) => {
    setCurrentSlide(swiper.realIndex);
  };

  useEffect(() => {
    // fetchMangaDetailsは非同期関数で、サーバーから漫画の詳細情報を取得する
    const fetchMangaDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5227/api/Sells/${sellId}`);
        const data = await response.json();
        setMangaDetail(data);
      } catch (error) {
        console.error('Failed to fetch manga details:', error);
      }
    };

    fetchMangaDetails();
  }, [sellId]);

  if (!mangaDetail) {
    return <div>Loading...</div>;
  }

  // 現地時間にする調整が必要！！
  const formattedSellTime = dayjs(mangaDetail.sellTime).format('YYYY年MM月DD日');

  return (
    <Box sx={{ p: 0, margin:0 }}>
      {/* 戻るボタン */}
      <BackButton handleBack={handleBack} />
      <Box sx={{ flexGrow: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minHeight: '100vh', pb: 10 }}>
        <Grid container spacing={0} style={{ padding: 0, margin:0, marginBottom: 0}}>
          {/* Image Carousel Integration */}
          <ImageCarousel imageUrls={mangaDetail.imageUrls} title={mangaDetail.title} />

          <Grid item xs={12} md={6}style={{ padding: 0, margin:0 }}>
            <Paper elevation={0} sx={{ pt: 2.3, pb: 1, pl: 3.5, pr: 1, border: 'none' }}>
              <Grid container spacing={0} alignItems="center" sx={{pt:1}}>
                <Grid item xs={7}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 548 }}>
                    {mangaDetail.title}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={0} style={{ padding: 0, margin:0, marginBottom: 0}}>   
                <Grid item xs={1.6}sx={{ pt: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                  <Typography variant="h6" sx={{ color: '#E97132', fontWeight: 'bold'}} >
                    {' '}全巻{' '}
                  </Typography>
                </Grid>
                <Grid item xs={1.8}sx={{pt: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                  <Typography variant="h4" sx={{ color: 'black', fontWeight: 300}}>
                    {mangaDetail.numberOfBooks}
                  </Typography>
                </Grid>
                <Grid item xs={0.8}sx={{pt: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                  <Typography variant="h6" sx={{ color: 'black', fontWeight: 548}}>
                    巻
                  </Typography>
                </Grid>
                <Grid item xs={7.8}sx={{pb:0.6, pt: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                  <Typography variant="h6" sx={{ color: '#49AFFE', fontWeight: 548, fontSize: '1.0rem' }}>
                    {`${mangaDetail.bookState}`}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="h6" gutterBottom sx={{pt:3, pb:3, color: '#757575'}}>
                  {`${formattedSellTime}に出品`}
              </Typography>
              <Grid container spacing={0.5} alignItems="center" sx={{ pr:2.5}}>
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom sx={{pt:4, color: '#757575', fontWeight:'bold',  borderTop: '1px solid #757575' }}>
                    {`この人が欲しい漫画`}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                {mangaDetail.wishTitles.map((wish, index) => (
                  <Chip key={index} label={wish.title} variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </Box>
              <Grid container spacing={0.5} alignItems="center" sx={{ pr:2.5}}>
                <Grid item xs={6}>
                  <Typography variant="body1" gutterBottom sx={{pt:2, color: '#757575', fontWeight:'bold'}}>
                    {`出品物の説明`}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {mangaDetail.sellMessage}
              </Typography>
              <Grid container spacing={0.5} alignItems="center">
                <Grid item xs={3.5}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{py:2}}>
                    <Avatar src={mangaDetail.profileIcon} alt={mangaDetail.userName} />
                    <Typography variant="subtitle1" sx={{pl:1, fontWeight:`bold`}}>{mangaDetail.userName}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {mangaDetail.hasIdVerificationImage ? (
                    <BeenhereRoundedIcon color="primary" sx={{ display: 'flex', justifyContent: 'center', alignItems: `center`}}/> // 塗りつぶしたアイコン
                  ) : (
                    <BeenhereOutlinedIcon color="disabled" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} /> // 塗りつぶさないアイコン
                  )}
                </Grid>
              </Grid>  
              <Grid container spacing={0.5} alignItems="center" sx={{ pr:2.5}}>
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom sx={{pb:2, color: '#757575', fontWeight:'bold',  borderBottom: '1px solid #757575' }}>
                    {`出品物の情報`}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={0.5} alignItems="center">
                <Grid item xs={5}>
                  <Typography variant="body2" gutterBottom sx={{pt:2, color: 'black', fontWeight:'bold'}}>
                    {`配送元の地域`}
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1" gutterBottom sx={{pt:2, color: 'black'}}>
                  {mangaDetail.sendPrefecture}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={0.5} alignItems="center">
                <Grid item xs={5}>
                  <Typography variant="body2" gutterBottom sx={{pt:2, color: 'black', fontWeight:'bold'}}>
                    {`発送までの日時`}
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1" gutterBottom sx={{pt:2, color: 'black'}}>
                  {mangaDetail.sendDay}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ px: 2, py:2, position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', background: 'white', boxShadow: '0px 8px 12px 10px rgba(0, 0, 0, 0.25)' }}>
                <Button variant="contained" color="primary" sx={{ px:0, width: '100%', background: 'linear-gradient(to right, #E97132, #F2CFEE)', boxShadow:'none', color:'#f5f5f5'}}>
                  交換を希望する
                </Button>
      </Box>
    </Box>
  );
};

export default MangaDetail;
