// MpAdressUpadate

import React from 'react';
import { Typography } from '@mui/material';
import MenuBar from '../components/menu/MenuBar';
import CustomToolbar from '../components/common/CustumToolbar';

const MpAdressUpdate: React.FC = () => {
  return (
    <>
      {/* CustomToolbarはそのままにする */}
      <CustomToolbar title='Emailとか' />
      <Typography variant="h4" component="h1" sx={{pt:10}}>
        My本棚だな住所
      </Typography>

      {/* MenuBarはそのままにする */}
      <MenuBar />
    </>
  );
};

export default MpAdressUpdate;