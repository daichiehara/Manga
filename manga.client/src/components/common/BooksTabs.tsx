import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Box, Typography } from '@mui/material';
import axios from 'axios';
import BooksList from '../item/BooksList';
import { useBooks } from '../context/BookContext';
import { Divider } from '@mui/material';
import AutoStoriesOutlined from '@mui/icons-material/AutoStoriesOutlined';


const API_BASE_URL = 'https://localhost:7103/api';

interface Book {
  id: string;  // Assume each book has a unique ID
  title: string;
}

interface BooksTabsProps {
  triggerFetch: boolean;  // New prop to control data fetching
}

const BooksTabs: React.FC<BooksTabsProps> = ({ triggerFetch }) => {
  const { addBook } = useBooks(); // Use the context method to add books globally
  const [tabIndex, setTabIndex] = useState(0);
  const [ownedLists, setOwnedLists] = useState<Book[]>([]);
  const [sells, setSells] = useState<Book[]>([]);
  const [wishLists, setWishLists] = useState<Book[]>([]);

  useEffect(() => {
    if (triggerFetch) {  // Fetch data only when triggerFetch is true
      fetchBooksData();
      fetchWishLists();
    }
  }, [triggerFetch]);  // Depend on triggerFetch

  const fetchBooksData = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/OwnedLists`, { withCredentials: true });
    console.log('owned_fetch叩かれた');
    setOwnedLists(data.ownedLists);
    setSells(data.sells);
    data.ownedLists.concat(data.sells).forEach((book: Book) => addBook({ id: book.id, title: book.title }));
  };

  const fetchWishLists = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/WishLists`, { withCredentials: true });
    console.log('wish_fetch叩かれた');
    setWishLists(data);
    data.forEach((book: Book) => addBook({ id: book.id, title: book.title }));
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ 
    mt:1,
    
    display: 'flex', 
    justifyContent: 'center',
    alignItems: 'center', // 追加: コンテンツを垂直方向の中心にも配置
    p: 0,
    background: 'orange', 
    boxShadow: '0px -4px 5px -1px rgba(0,0,0,0.2)', 
    color: 'white',
    zIndex: 6000,
    borderRadius: '50%', 
    width: '5rem', 
    height: '5rem', 
    position: 'relative', // 追加: 絶対位置または相対位置にする
    
    left: '50%',
    transform: 'translateX(-50%)', // 修正: X軸のみ移動
  }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <AutoStoriesOutlined sx={{fontSize:`2rem`}} />
        <Typography variant='body2' sx={{}}>マイ本棚</Typography>
        </Box>
        {/*<Divider sx={{height:'2px', width: `50px`,borderRadius: '50px', background:'#D9D9D9' }} />*/}
      </Box>
      <Box sx={{pt:`0.3rem`,display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
        <Tabs 
          value={tabIndex}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            
            
          }}
          // タブのインジケーターのカスタムスタイルを適用
          TabIndicatorProps={{ 
            style: {
              marginBottom: '0.5rem', 
              paddingBottom: '1.0rem', 
              height: '1.0rem', 
              background: '#F2F2F2', 
              borderRadius: '50px', 
              
            }
          }}
        >
          <Tab disableRipple sx={{zIndex: 1000, }} label="持っている漫画" />
          <Tab disableRipple sx={{zIndex: 1000, }} label="欲しい漫画" />
        </Tabs>
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
        <Typography variant='subtitle2' sx={{color:'#707070',}}>※ 登録すると検索がしやすくなります!</Typography>
      </Box>
      
      {tabIndex === 0 && (
        <>
          <BooksList key="owned-lists" title="簡単登録" books={ownedLists} />
          <BooksList key="sells" title="出品中の漫画" books={sells} />
        </>
      )}
      {tabIndex === 1 && (
        <BooksList key="wish-lists" title="欲しい漫画" books={wishLists} />
      )}
      <Typography variant='h1'>aaaa</Typography>
      <Typography variant='h1'>aaaa</Typography>
      <Typography variant='h1'>aaaa</Typography>
    </Box>
  );
};

export default BooksTabs;
