import React from 'react';
import {Typography, Grid, Paper } from '@mui/material';
import dayjs from 'dayjs';

interface MangaDetailInfoProps {
    title: string;
    numberOfBooks: number;
    bookState: string;
    sellTime: string;
  }  

const MangaDetailInfo: React.FC<MangaDetailInfoProps> = ({ title, numberOfBooks, bookState, sellTime }) => {
  // Format the selling time using dayjs
  const formattedSellTime = dayjs(sellTime).format('YYYY年MM月DD日');

  return (
    <Paper elevation={0} sx={{ pt: 2.3, pb: 1, pl: 3.5, pr: 1, border: 'none' }}>
      <Grid container spacing={0} alignItems="center" sx={{pt:1}}>
        <Grid item xs={7}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 548 }}>
            {title}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={0}>
        <Grid item xs={1.6} sx={{ pt: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          <Typography variant="h6" sx={{ color: '#E97132', fontWeight: 'bold' }}>
            全巻
          </Typography>
        </Grid>
        <Grid item xs={1.8} sx={{ pt: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          <Typography variant="h4" sx={{ color: 'black', fontWeight: 300 }}>
            {numberOfBooks}
          </Typography>
        </Grid>
        <Grid item xs={0.8} sx={{ pt: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          <Typography variant="h6" sx={{ color: 'black', fontWeight: 548 }}>
            巻
          </Typography>
        </Grid>
        <Grid item xs={7.8} sx={{ pb: 0.6, pt: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          <Typography variant="h6" sx={{ color: '#49AFFE', fontWeight: 548, fontSize: '1.0rem' }}>
            {bookState}
          </Typography>
        </Grid>
      </Grid>
      <Typography variant="h6" gutterBottom sx={{ pt: 3, pb: 3, color: '#757575' }}>
        {`${formattedSellTime}に出品`}
      </Typography>
    </Paper>
  );
};

export default MangaDetailInfo;
