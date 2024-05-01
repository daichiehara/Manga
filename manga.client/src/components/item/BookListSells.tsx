import React from 'react';
import { List, ListItem, ListItemText, IconButton, Collapse, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
interface Book {
  itemId: number;  // 'id' was changed to 'itemId'
  title: string;
}

interface BooksListSellsProps {
  title: string;
  books: Book[];
}

const BooksListSells: React.FC<BooksListSellsProps> = React.memo(({ title, books}) => {
  console.log("Books data:", books);  // Logging data for debugging

  return (
    <div>
      <Typography variant="h5" style={{fontWeight:`bold`, color: '#EB4848' }}>
        {title}
      </Typography>
      <List>
        {books.map((book) => (
        <Collapse key={book.itemId}> 
            <ListItem 
            secondaryAction={
                <IconButton
                edge="end"
                aria-label="delete"
                title="Delete"
                >
                <DeleteIcon />
                </IconButton>
            }
            >
            <ListItemText primary={book.title} />
            </ListItem>
        </Collapse>
        ))}
        
      </List>
    </div>
  );
});

export default BooksListSells;
