import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Box } from '@mui/material';
import axios from 'axios';
import BooksList from '../item/BooksList';
import { useBooks } from '../context/BookContext';

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
