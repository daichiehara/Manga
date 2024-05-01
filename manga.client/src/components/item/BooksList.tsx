import React from 'react';
import { List, ListItem, ListItemText, IconButton, Collapse, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { TransitionGroup } from 'react-transition-group';

interface Book {
  itemId: number;  // 'id' was changed to 'itemId'
  title: string;
}

interface BooksListProps {
  title: string;
  titleColor:string;
  books: Book[];
  onRemove: (itemId: number) => void;  // 'sellId' was changed to 'itemId'
}

const BooksList: React.FC<BooksListProps> = React.memo(({ title, titleColor, books, onRemove }) => {
  console.log("Books data:", books);  // Logging data for debugging

  return (
    <div>
      <Typography variant="h5"  style={{fontWeight:`bold`, color: titleColor }}>
        {title}
      </Typography>
      <List >
        <TransitionGroup>
          {books.map((book) => (
            <Collapse key={book.itemId}> 
              <ListItem
                disableGutters
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    title="Delete"
                    onClick={() => onRemove(book.itemId)}
                  >
                    <CancelIcon sx={{color:`#D9D9D9`}}/>
                  </IconButton>
                }
              >
                <ListItemText primary={book.title} />
              </ListItem>
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
    </div>
  );
});

export default BooksList;
