import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BookListWish from '../item/BookListWish';
import { useBooks } from '../context/BookContext';
import axios from 'axios';
import { API_BASE_URL } from '../../apiName';


interface Book {
  itemId: number;
  title: string;
}

const WishListAccordion: React.FC = () => {
  const [wishLists, setWishLists] = useState<Book[]>([]);
  const { addBook } = useBooks();

  const fetchWishLists = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/WishLists`, { withCredentials: true });
      console.log('wish_fetch叩かれた');
      setWishLists(data);
      data.forEach((book: Book) => addBook({ itemId: book.itemId, title: book.title }));
    } catch (error) {
      console.error('Error fetching wish lists:', error);
    }
  };

  const handleRemoveWishLists = async (itemId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/WishLists/${itemId}`, { withCredentials: true });
      setWishLists(prevWishLists => prevWishLists.filter(book => book.itemId !== itemId));
      console.log('Wish list book removed successfully:', itemId);
    } catch (error) {
      console.error('Error removing wish list book:', error);
    }
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        onClick={fetchWishLists}
      >
        <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: 'bold' }}>
          追加の設定
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>欲しい漫画登録でマッチ率UP</Typography>
        
      </AccordionSummary>
      <AccordionDetails>
        <BookListWish
          key="wish-lists"
          title="欲しい漫画"
          books={wishLists}
          onRemove={handleRemoveWishLists}
          onRefreshWishList={fetchWishLists}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default WishListAccordion;