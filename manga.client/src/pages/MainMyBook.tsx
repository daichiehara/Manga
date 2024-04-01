import React from 'react';
import { Typography } from '@mui/material';
import MenuBar from '../components/menu/MenuBar';

const MainMyBook: React.FC = () => {
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        My本棚だな
      </Typography>
      <MenuBar />
    </>
  );
};

export default MainMyBook;
