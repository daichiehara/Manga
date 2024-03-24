import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Typography, Paper, Grid, Avatar, Stack } from '@mui/material';
import Chip from '@mui/material/Chip';
import dayjs from 'dayjs';

const MangaDetail = () => {
  const { sellId } = useParams();
  const [mangaDetail, setMangaDetail] = useState(null);

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

  // Format the sell time to a more readable format
  const formattedSellTime = dayjs(mangaDetail.sellTime).format('YYYY/MM/DD');

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {/* Display all images */}
          {mangaDetail.imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`${mangaDetail.title} Volume ${index + 1}`} style={{ maxWidth: '100%', marginBottom: '8px' }} />
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
              {mangaDetail.title}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {`Total Volumes: ${mangaDetail.numberOfBooks}`}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {`Condition: ${mangaDetail.bookState}`}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {`Posted: ${formattedSellTime}`}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar src={mangaDetail.profileIcon} alt={mangaDetail.userName} />
              <Typography variant="subtitle1">{mangaDetail.userName}</Typography>
            </Stack>
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
