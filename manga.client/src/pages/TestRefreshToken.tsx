import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';

const Test: React.FC = () => {
  useEffect(() => {
    axios.get('http://localhost:5227/api/Users/protected', {withCredentials: true})
      .then(response => {
        console.log("Success!");
        console.log(response.data); // これはAPIからのレスポンスのデータを表示します
      })
      .catch(error => {
        console.error("An error occurred:", error);
      });
  }, []);

  return (
    <Box>
      <Typography variant="h5">テスト</Typography>
    </Box>
  );
};

export default Test;
