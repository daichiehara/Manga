import React from 'react';
import { List, ListItem, ListItemText, IconButton, Collapse, Typography, Box, Button, Divider } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { TransitionGroup } from 'react-transition-group';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddIcon from '@mui/icons-material/Add';
import WishSearchModal from '../common/WishSearchModal';

interface Book {
  itemId: number;
  title: string;
}

interface BookListWishProps {
  title: string;
  books: Book[];
  onRemove: (itemId: number) => void;
  onRefreshWishList: () => void;
}

const BookListWish: React.FC<BookListWishProps> = ({ title, books, onRemove, onRefreshWishList }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    onRefreshWishList();
  };

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <RocketLaunchIcon sx={{ fontsize: '1rem', mr: 1, alignSelf: 'center', color: `#0F9ED5` }} />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#757575' }}>
            {title}
          </Typography>
        </Box>
        <IconButton>
          <HelpOutlineIcon sx={{ fontsize: '3rem', ml: 1, alignSelf: 'center', color: '#BFBFBF' }} />
        </IconButton>
      </Box>
      <Box sx={{ pt: 2, display: 'flex', alignItems: 'center' }}>
        <Button disableRipple onClick={handleOpen}>
          <AddIcon sx={{ color: '#0F9ED5' }} />
          <Typography variant="subtitle2" sx={{ color: '#0F9ED5' }}>
            あなたが欲しい漫画を追加する
          </Typography>
        </Button>
      </Box>
      <WishSearchModal isOpen={isOpen} onClose={handleClose} onRefreshWishList={onRefreshWishList} />
      <List>
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
                    <CancelIcon sx={{ color: `#D9D9D9` }} />
                  </IconButton>
                }
              >
                <ListItemText primary={book.title} />
              </ListItem>
              <Divider sx={{ width: '100%' }} />
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
    </div>
  );
};

export default BookListWish;
