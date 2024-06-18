import React, { useState, useEffect, useCallback, memo } from 'react';
import { List, ListItem, ListItemText, IconButton, Collapse, Typography, Box, Divider, Button, } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { TransitionGroup } from 'react-transition-group';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AddIcon from '@mui/icons-material/Add';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import OwnedSearchModal from '../common/OwnedSearchModal';

interface Book {
  itemId: number;  // 'id' was changed to 'itemId'
  title: string;
}

interface BookListOwnedProps {
  title: string;
  books: Book[];
  onRemove: (itemId: number) => void;  // 'sellId' was changed to 'itemId'
  onRefreshOwnedList: () => void;
}

const BookListOwned: React.FC<BookListOwnedProps> = React.memo(({ title, books, onRemove, onRefreshOwnedList }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    onRefreshOwnedList();
  };

  const handleSearch = useCallback((query: string) => {
    // 検索処理
  }, []);  // 依存配列が空なので、コンポーネントのライフタイムで一度だけ生成される

  return (
    <div>
      <Box sx={{display: 'flex', alignItems: 'center',}}>
        <RocketLaunchIcon sx={{ fontsize:'1rem',mr: 1, alignSelf: 'center', color: '#EB4848' }}/>
        <Box sx={{display: 'flex', flexDirection: 'column',}}>
          <Typography variant="subtitle1" sx={{fontWeight: 'bold', color: '#757575'}}>
            {title}
          </Typography>
        </Box>
        <IconButton>
          <HelpOutlineIcon sx={{fontsize:'3rem', ml: 1, alignSelf: 'center', color: '#BFBFBF' }}/>
        </IconButton>
      </Box>
      <Box  sx={{pt:2, display: 'flex', alignItems: 'center',}}>
        <Button disableRipple onClick={handleOpen}>
        <AddIcon sx={{color: '#0F9ED5', }}/>
        <Typography variant="subtitle2" sx={{color: '#0F9ED5', }}>
          全巻持っている漫画を追加する
        </Typography>
        </Button>
      </Box>
      <OwnedSearchModal isOpen={isOpen} onClose={handleClose} onRefreshOwnedList={onRefreshOwnedList} />
      <List >
        <TransitionGroup>
          {books.map((book) => (
            <Collapse key={book.itemId}> 
              <ListItem
                disableGutters secondaryAction={
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
              <Divider sx={{ width: '100%' }}/>
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
    </div>
  );
});

export default BookListOwned;
