import React from 'react';
import { Typography } from '@mui/material';
import MenuBar from '../components/menu/MenuBar';

const MainNotification: React.FC = () => {
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        通知ん
      </Typography>
      <MenuBar />
    </>
  );
};

export default MainNotification;
