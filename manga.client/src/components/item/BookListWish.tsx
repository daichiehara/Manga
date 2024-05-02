import React from 'react';
import { List, ListItem, ListItemText, IconButton, Collapse, Typography, Box } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { TransitionGroup } from 'react-transition-group';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

interface Book {
  itemId: number;  // 'id' was changed to 'itemId'
  title: string;
}

interface BookListWishProps {
  title: string;
  books: Book[];
  onRemove: (itemId: number) => void;  // 'sellId' was changed to 'itemId'
}

const BookListWish: React.FC<BookListWishProps> = React.memo(({ title, books, onRemove }) => {

  return (
    <div>
      <Box sx={{display: 'flex', alignContent: 'center',}}>
      <RocketLaunchIcon sx={{mr:1,alignSelf: 'center' ,color: `#0F9ED5`}}/>
      <Typography variant="subtitle1"  sx={{fontWeight:`bold`, color: '#757575'}}>
        {title}
      </Typography>
      </Box>
      <Box sx={{display: 'flex', alignContent: 'center'}}>
        <Typography variant='subtitle2' sx={{py:1, color:'#707070',}}>出品で必要になります。</Typography>
      </Box>
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

export default BookListWish;
