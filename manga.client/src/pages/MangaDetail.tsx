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
  const formattedSellTime = dayjs(mangaDetail.sellTime).format('YYYY/MM/DD');

  return (
    <Box sx={{ p: 0, margin:0 }}>
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
          <Paper elevation={0} sx={{ pt: 0.5, pb: 1, pl: 1.5, pr: 1, border: 'none' }}>
            <Grid container spacing={0} alignItems="center" sx={{pt:1}}>
              <Grid item xs={7}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 548 }}>
                  {mangaDetail.title}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={5}sx={{ pl: 2}}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: '#757575', fontSize: '0.9rem'}} >
                  {' '}全巻{' '}
                  <span style={{ fontSize: 'smaller' }}>
                    ({mangaDetail.numberOfBooks}巻)
                  </span>
                </Typography>
                <Typography variant="subtitle2" gutterBottom sx={{ color: '#757575', fontSize: '0.9rem'}}>
                  {`状態 : ${mangaDetail.bookState}`}
                </Typography>
                <Typography variant="subtitle2" gutterBottom sx={{ color: '#757575', fontSize: '0.9rem'}}>
                  {`投稿日: ${formattedSellTime}`}
                </Typography>
              </Grid>

            <Grid container spacing={0.5} alignItems="center">
              <Grid item xs={6}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{py:2}}>
                  <Avatar src={mangaDetail.profileIcon} alt={mangaDetail.userName} />
                  <Typography variant="subtitle1">{mangaDetail.userName}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={6}>
              </Grid>
            </Grid>
            <Typography variant="body1" gutterBottom sx={{pt:2, color: '#757575', fontWeight:'bold'}}>
                {`出品物の説明`}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {mangaDetail.sellMessage}
            </Typography>
            {/* Wishlist Titles */}
            <Box sx={{ mt: 2 }}>
              {mangaDetail.wishTitles.map((wish, index) => (
                <Chip key={index} label={wish.title} variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
              ))}
            </Box>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Would like to exchange
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MangaDetail;
