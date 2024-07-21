import {  useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import CustomToolbar from '../components/common/CustumToolbar';
import React, { useState, useEffect, useContext } from 'react';
import MenuBar from '../components/menu/MenuBar';
import axios from 'axios';
import { AuthContext } from '../components/context/AuthContext';
import MangaListItem from '../components/item/MangaListItem';
import { Box, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';



interface CommentPage {
  
}

const CommentPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 前のページに戻る
  };

    // AuthContextから認証状態を安全に取得
    const authContext = useContext(AuthContext);
    const isAuthenticated = authContext ? authContext.authState.isAuthenticated : false;
  
  return (
    <>
      {/* 見出しのToolbar */}
      <CustomToolbar title='コメント'/>    

      {/* コメント */}
      <Typography>
        あああああ
      </Typography>

   
    </>
  );
};

export default CommentPage;
