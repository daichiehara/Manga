import React from 'react';
import {Typography, Grid, Paper, Box } from '@mui/material';
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
    <Paper elevation={0} sx={{ pt: 1, pb: 1, pl: 2.0, pr: 1, border: 'none' }}>
      <Grid container spacing={0} alignItems="center" sx={{pt:1}}>
        
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
      </Grid>
      <Grid container spacing={0}>
        
      <Typography variant="h6"  sx={{color: '#B12704', py:0.1}}>
              全巻
            <Box component="span" sx={{ color: '#757575',pl:1 }}>({numberOfBooks}巻)</Box>
      </Typography> 
      </Grid>
      <Typography variant="subtitle1" sx={{ pt: 2, pb: 0.5, color: '#156082'}}>
        {bookState}
      </Typography>
      <Typography variant="subtitle1"  sx={{ pt: 0.5, pb: 0, color: '#757575' }}>
        {`${formattedSellTime}に出品`}
      </Typography>
    </Paper>
  );
};

export default MangaDetailInfo;
