import React from 'react';
import { Typography, Box, Grid } from '@mui/material';
import BeenhereRoundedIcon from '@mui/icons-material/BeenhereRounded';
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined';

interface VerificationStatusProps {
  isVerified: boolean;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({ isVerified }) => {
  const content = isVerified ? (
    <>
      <BeenhereRoundedIcon color="primary" />
      <Typography variant="body1" sx={{ pl: 1 }}>
        本人確認済
      </Typography>
    </>
  ) : (
    <>
      <BeenhereOutlinedIcon color="disabled" />
      <Typography variant="body1" sx={{ pl: 1 }}>
        本人確認前
      </Typography>
    </>
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {content}
    </Box>
  );
};

export default VerificationStatus;