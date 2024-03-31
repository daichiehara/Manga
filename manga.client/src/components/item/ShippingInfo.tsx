import React from 'react';
import { Grid, Typography } from '@mui/material';

interface ShippingInfoProps {
    sendPrefecture: string;
    sendDay: string;
  }

const ShippingInfo: React.FC<ShippingInfoProps> = ({ sendPrefecture, sendDay }) => {
  return (
    <Grid container spacing={0.5} alignItems="center">
      <Grid item xs={5}>
        <Typography variant="body2" gutterBottom sx={{pt:2, color: 'black', fontWeight:'bold'}}>
          {'配送元の地域'}
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <Typography variant="body1" gutterBottom sx={{pt:2, color: 'black'}}>
          {sendPrefecture}
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <Typography variant="body2" gutterBottom sx={{pt:2, color: 'black', fontWeight:'bold'}}>
          {'発送までの日時'}
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <Typography variant="body1" gutterBottom sx={{pt:2, color: 'black'}}>
          {sendDay}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ShippingInfo;