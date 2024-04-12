import React from 'react';
import { Typography } from '@mui/material';
import MenuBar from '../components/menu/MenuBar';

const MainMpFavoList: React.FC = () => {
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        出川くんの
      </Typography>
      <MenuBar />
    </>
  );
};

export default MainMpFavoList;
