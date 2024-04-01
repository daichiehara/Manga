import React from 'react';
import { Typography } from '@mui/material';
import MenuBar from '../components/menu/MenuBar';

const MainMyPage: React.FC = () => {
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        マイペーじー
      </Typography>
      <MenuBar />
    </>
  );
};

export default MainMyPage;
