import React from 'react';
import { Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';

interface ShippingInfoProps {
    sendPrefecture: string;
    sendDay: string;
    sellTime: string;
  }

const ShippingInfo: React.FC<ShippingInfoProps> = ({ sendPrefecture, sendDay, sellTime }) => {
  const formattedSellTime = dayjs(sellTime).format('YYYY年MM月DD日');

  return (
    <Grid container spacing={0.5} alignItems="center">
      <Grid item xs={5}>
        <Typography variant="body2" gutterBottom sx={{pt:0, color: 'black', fontWeight:'bold'}}>
          {'配送元の地域'}
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <Typography variant="body2" gutterBottom sx={{pt:0, color: 'black'}}>
          {sendPrefecture}
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <Typography variant="body2" gutterBottom sx={{pt:0, color: 'black', fontWeight:'bold'}}>
          {'発送までの日時'}
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <Typography variant="body2" gutterBottom  sx={{pt:0, color: 'black'}}>
          {sendDay}
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <Typography variant="body2"  sx={{pt:0, color: 'black', fontWeight:'bold'}}>
          {'出品日'}
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <Typography variant="body2"  sx={{pt:0, color: 'black'}}>
          {formattedSellTime}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ShippingInfo;