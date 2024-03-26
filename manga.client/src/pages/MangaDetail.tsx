import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Typography, Paper, Grid, Avatar, Stack } from '@mui/material';
import Chip from '@mui/material/Chip';
import dayjs from 'dayjs';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

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
  }  

const MangaDetail = () => {
  const { sellId } = useParams();
  const [mangaDetail, setMangaDetail] = useState<MangaDetail | null>(null);

  console.log(sellId);

  useEffect(() => {
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
      <Box sx={{ flexGrow: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minHeight: '100vh', pb: 10 }}>
        <Grid container spacing={0} style={{ padding: 0, margin:0, marginBottom: 0}}>
          <Grid item style={{ display: 'flex', justifyContent: 'center',  padding: 0, margin:0, marginBottom: 0, overflow: 'hidden' }}>
              <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  onSlideChange={() => console.log('slide change')}
                  onSwiper={(swiper) => console.log(swiper)}
              >
                  {mangaDetail.imageUrls.map((url, index) => (
                  <SwiperSlide key={index}style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <img src={url} alt={`${mangaDetail.title} Volume ${index + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', height: '30rem', objectFit: 'contain', background: '#f5f5f5'}} />
                  </SwiperSlide>
                  ))}
              </Swiper>
          </Grid>
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
              <Grid container spacing={0.5} alignItems="center">
                <Grid item xs={6}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{py:2}}>
                    <Avatar src={mangaDetail.profileIcon} alt={mangaDetail.userName} />
                    <Typography variant="subtitle1">{mangaDetail.userName}</Typography>
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={0.5} alignItems="center">
                <Grid item xs={6}>
                  <Typography variant="body1" gutterBottom sx={{pt:2, color: '#757575', fontWeight:'bold'}}>
                    {`出品物の説明`}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {mangaDetail.sellMessage}
              </Typography>
              {/* Wishlist Titles */}
              <Box sx={{ mt: 2 }}>
                {mangaDetail.wishTitles.map((wish, index) => (
                  <Chip key={index} label={wish.title} variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </Box>
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
