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
        
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 548 }}>
            {title}
          </Typography>
          <Typography variant="h6" gutterBottom sx={{pl:2, color: '#E97132', fontWeight: 'bold' }}>
            全巻
          </Typography>
      </Grid>
      <Grid container spacing={0}>
        
        <Grid item xs={1.8} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ color: 'black', fontSize: `2.5rem` , fontWeight: 'light' }}>
            {numberOfBooks}
          </Typography>
        </Grid>
        <Grid item xs={0.9} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ color: 'black', fontWeight: 548 }}>
            巻
          </Typography>
        </Grid>
        
      </Grid>
      <Typography variant="h6" sx={{ pt: 2, pb: 1, color: '#156082', fontWeight: 548, fontSize: '1.0rem' }}>
            {bookState}
          </Typography>
      <Typography variant="h6" gutterBottom sx={{ pt: 2, pb: 2, color: '#757575' }}>
        {`${formattedSellTime}に出品`}
      </Typography>
    </Paper>
  );
};

export default MangaDetailInfo;
