// BooksList.tsx
import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

interface Book {
  id: string;
  title: string;
}

interface BooksListProps {
  title: string;
  books: Book[];
}

const BooksList: React.FC<BooksListProps> = React.memo(({ title, books }) => {
  //console.log(`Rendering BooksList - ${title}`, books);

  return (
    <div>
      <h2>{title}</h2>
      <List>
        {books.map((book, index) => (
          // Adding index to the key for debugging, should not be used in production if ids are unique
          <ListItem key={book.id || index}>
            <ListItemText primary={book.title} />
          </ListItem>
        ))}
      </List>
    </div>
  );
});

export default BooksList;
