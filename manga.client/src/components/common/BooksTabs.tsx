import React, { useState, useEffect, useContext } from 'react';
import { Tab, Tabs, Box, Typography } from '@mui/material';
import axios from 'axios';
import { useBooks } from '../context/BookContext';
import BookListWish from '../item/BookListWish';
import AutoStoriesOutlined from '@mui/icons-material/AutoStoriesOutlined';
import BooksListSells from '../item/BookListSells';
import BookListOwned from '../item/BookListOwned';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';

const API_BASE_URL = 'https://localhost:7103/api';

interface Book {
  itemId: number;  // `id` を `itemId` に変更
  title: string;
}

interface BooksTabsProps {
  triggerFetch: boolean;  // New prop to control data fetching
  initialTab?: number;
}

type BookId = number; // `bookId`は文字列型ですが、意味の明確化のために型エイリアスを使用しています。
type WishList = Book[]; // WishListはBookの配列です

const BooksTabs: React.FC<BooksTabsProps> = ({ triggerFetch, initialTab = 0 }) => {
  const { addBook } = useBooks(); // Use the context method to add books globally
  const { authState } = useContext(AuthContext);
  const [tabIndex, setTabIndex] = useState(initialTab);
  const [ownedLists, setOwnedLists] = useState<Book[]>([]);
  const [sells, setSells] = useState<Book[]>([]);
  const [wishLists, setWishLists] = useState<Book[]>([]);
  const { refreshAllData } = useContext(AppContext);

  useEffect(() => {
    setTabIndex(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (triggerFetch) {
      if (authState.isAuthenticated) {
        fetchBooksData();
        fetchWishLists();
      } else {
        // ゲストユーザーの場合、ローカルストレージから所有リストを取得
        const storedOwnedList = JSON.parse(localStorage.getItem('guestMangaList') || '[]');
        setOwnedLists(storedOwnedList);
      }
    }
  }, [triggerFetch, authState.isAuthenticated]);

  const fetchBooksData = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/OwnedLists`, { withCredentials: true });
    console.log('owned_fetch叩かれた');
    setOwnedLists(data.ownedLists);
    setSells(data.sells);
    console.log(sells);
    data.ownedLists.concat(data.sells).forEach((book: Book) => addBook({ itemId: book.itemId, title: book.title }));
  };
  
  const fetchWishLists = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/WishLists`, { withCredentials: true });
    console.log('wish_fetch叩かれた');
    setWishLists(data);
    data.forEach((book: Book) => addBook({ itemId: book.itemId, title: book.title }));
  };
  
  const removeOwnedLists = async (itemId: BookId) => {
    if (authState.isAuthenticated) {
      try {
        await axios.delete(`${API_BASE_URL}/OwnedLists/${itemId}`, { withCredentials: true });
        console.log('Owned list book removed:', itemId);
      } catch (error) {
        handleError(error);
        throw error;
      } 
    } else {
      // ゲストユーザーの場合、ローカルストレージから削除
      const storedOwnedList = JSON.parse(localStorage.getItem('guestMangaList') || '[]');
      const updatedList = storedOwnedList.filter((book: Book) => book.itemId !== itemId);
      localStorage.setItem('guestMangaList', JSON.stringify(updatedList));
      console.log('Guest owned list book removed:', itemId);
    }

    await refreshAllData();
  };
  
  const removeWishLists = async (sellId: BookId) => {
    try {
      await axios.delete(`${API_BASE_URL}/WishLists/${sellId}`, { withCredentials: true });
      console.log('Wish list book removed:', sellId);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const handleRemoveOwnedLists = async (itemId: BookId) => {
    try {
      await removeOwnedLists(itemId);
      setOwnedLists(prevOwnedLists => prevOwnedLists.filter(book => book.itemId !== itemId));
      console.log('Owned list book removed successfully:', itemId);
    } catch (error) {
      handleError(error);
    }
  };

  const handleRemoveWishLists = async (itemId: BookId) => {
    try {
      await removeWishLists(itemId);
      setWishLists(prevWishLists => prevWishLists.filter(book => book.itemId !== itemId));
      console.log('Wish list book removed successfully:', itemId);
    } catch (error) {
      handleError(error);
    }
  };
  
  function handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('API request failed:', error.response ? error.response.data : error.message);
      alert('Error: ' + (error.response ? error.response.data.message : error.message));
    } else {
      console.error('Unexpected error:', error);
    }
  }

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
    background: '#E97032', 
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
      <Box sx={{py:`0.9rem`,display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
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
          <Tab disableRipple sx={{
            zIndex: 1000,
            '&.Mui-selected': {color: '#EB4848',}, 
          }} label="持っている漫画" />
          <Tab disableRipple sx={{
            zIndex: 1000, 
            '&.Mui-selected': {color: `#0F9ED5`,}, 
          }} label="欲しい漫画" />
        </Tabs>
      </Box>
      
      {tabIndex === 0 && (
        <>
          <BookListOwned  
            key="owned-lists" 
            title="とりあえず登録"  
            books={ownedLists} 
            onRemove={handleRemoveOwnedLists} 
            onRefreshOwnedList={authState.isAuthenticated ? fetchBooksData : () => {
                const storedOwnedList = JSON.parse(localStorage.getItem('guestMangaList') || '[]');
                setOwnedLists(storedOwnedList);
            }} 
          />
          <BooksListSells key="sells" title="あなたが出品中の漫画" books={sells}/>
        </>
      )}
      {tabIndex === 1 && (
        <>
        <BookListWish key="wish-lists" title="欲しい漫画" books={wishLists} onRemove={handleRemoveWishLists} onRefreshWishList={fetchWishLists} />
        </>
      )}
    </Box>
  );
};

export default React.memo(BooksTabs);
