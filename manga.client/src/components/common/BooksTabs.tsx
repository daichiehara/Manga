// BooksTabs.tsx
import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Box } from '@mui/material';
import { bookService } from '../../api/authService';
import BooksList from '../item/BooksList';

interface Book {
  id: string;
  title: string;
}

interface BooksApiResponse {
  ownedLists: Book[];
  sells: Book[];
}

const BooksTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);
  // ここでuseStateにジェネリック型引数を渡して、配列の要素の型を指定します。
  const [ownedLists, setOwnedLists] = useState<Book[]>([]);
  const [sells, setSells] = useState<Book[]>([]);
  const [wishLists, setWishLists] = useState<Book[]>([]);

  useEffect(() => {
    let isMounted = true; // Flag to check the mounted state

    async function fetchData() {
      try {
        const booksData = await bookService.getBooksData();
        const wishData = await bookService.getWishLists();

        if (isMounted) { // Only update state if the component is still mounted
          setOwnedLists(booksData.ownedLists);
          setSells(booksData.sells);
          setWishLists(wishData);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    }

    fetchData();

    return () => {
      isMounted = false; // Clean up the flag when the component is unmounted
    };
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tabIndex} onChange={handleChange} centered>
        <Tab label="Owned & Sells" />
        <Tab label="WishLists" />
      </Tabs>
      {tabIndex === 0 && (
        <>
          <BooksList key="owned-lists" title="Owned Lists" books={ownedLists} />
          <BooksList key="sells" title="Sells" books={sells} />
        </>
      )}
      {tabIndex === 1 && (
        <BooksList key="wish-lists" title="Wish Lists" books={wishLists} />
      )}
    </Box>
  );
};

export default BooksTabs;