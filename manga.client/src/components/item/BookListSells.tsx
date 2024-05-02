import React from 'react';
import { List, ListItem, ListItemText, IconButton, Collapse, Typography,Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
interface Book {
  itemId: number;  // 'id' was changed to 'itemId'
  title: string;
}

interface BooksListSellsProps {
  title: string;
  books: Book[];
}

const BooksListSells: React.FC<BooksListSellsProps> = React.memo(({ title, books}) => {

  return (
    <div>
      <Box sx={{pt:2,display: 'flex', alignContent: 'center',}}>
      <RocketLaunchIcon sx={{mr:1,alignSelf: 'center' ,color: 'orange'}}/>
      <Typography variant="subtitle1"  sx={{fontWeight:`bold`, color: '#757575'}}>
        {title}
      </Typography>
      </Box>
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
