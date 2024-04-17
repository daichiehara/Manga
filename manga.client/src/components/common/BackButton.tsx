import React from 'react';
import { Grid } from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackButtonProps extends IconButtonProps {
  handleBack: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ handleBack, ...rest }) => (
  <Grid container  sx={{position:`fixed`}}>
    <Grid item xs={1}>
  <IconButton
    onClick={handleBack}
    {...rest}
    sx={{
     
      
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
      },
    }}
  >
    <ArrowBackIcon />
  </IconButton>
  </Grid>
  <Grid item xs={11}></Grid>
  </Grid>
);

export default BackButton;