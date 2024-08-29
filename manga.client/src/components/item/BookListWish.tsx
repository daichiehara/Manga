import React, { useState, useEffect, useCallback, memo, useContext } from 'react';
import { List, ListItem, ListItemText, IconButton, Collapse, Chip, Typography, Box, Button, Divider , Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { TransitionGroup } from 'react-transition-group';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddIcon from '@mui/icons-material/Add';
import WishSearchModal from '../common/WishSearchModal';
import WishBookRegistSteps from './WishBookRegistSteps';
import { AuthContext } from '../context/AuthContext';
import NavigateToLoginBox from '../login/NavigateToLoginBox';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { authState } = useContext(AuthContext);

  const handleOpenDialog = () => setIsDialogOpen(true);   // ダイアログを開く
  const handleCloseDialog = () => setIsDialogOpen(false); // ダイアログを閉じる

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    onRefreshWishList();
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component="span" sx={{ mr:'12px',color: "#0F9ED5", fontWeight:`bold`, fontStyle:'italic' }}>
          want<Box component="span" sx={{ color: 'orange' }}>!!</Box>
        </Typography>
        {/* <RocketLaunchIcon sx={{ fontsize: '1rem', mr: 1, alignSelf: 'center', color: `#0F9ED5` }} /> */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#757575' }}>
            {title}
          </Typography>
        </Box>
        <IconButton onClick={handleOpenDialog}>  {/* ダイアログを開く */}
          <HelpOutlineIcon sx={{ fontsize: '3rem', ml: 1, alignSelf: 'center', color: '#BFBFBF' }} />
        </IconButton>
      </Box>
      <Box sx={{ pt: 2, display: 'flex', alignItems: 'center' }}>
      {authState.isAuthenticated ? (
          <Button disableRipple onClick={handleOpen}>
            <AddIcon sx={{ color: '#0F9ED5' }} />
            <Typography variant="subtitle2" sx={{ color: '#0F9ED5' }}>
              あなたが欲しい漫画を追加する
            </Typography>
          </Button>
        ) : (
          <Box>
            <Typography variant="body2" sx={{ mt: 5, textAlign: 'center' }}>
              ログインすると欲しい漫画を登録できます！
            </Typography>
            <NavigateToLoginBox height='30vh'/>
          </Box>
        )}
      </Box>
      {authState.isAuthenticated && (
        <>
          <WishSearchModal isOpen={isOpen} onClose={handleClose} onRefreshWishList={onRefreshWishList} currentBooks={books} />
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
        </>
      )}
      {/* ダイアログ */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} aria-hidden={!isDialogOpen} disableEnforceFocus>
      <Box sx={{ py: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography
          variant="h6"
          component="span"
          sx={{ mr: '12px', color: "#0F9ED5", fontWeight: 'bold', fontStyle: 'italic' }}
        >
          want
          <Box component="span" sx={{ color: 'orange' }}>!!</Box>
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#757575' }}>
            {title}
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{pt:0, px:0}}>
        <Box sx={{px:2, }}>
          <Box sx={{py:'1rem'}}>
            <Chip
              sx={{
                height: 'auto',
                pl: 0,
                '& .MuiChip-label': {
                  display: 'block',
                  whiteSpace: 'normal',
                  padding: '0.5rem',
                },
              }}
              label={
                <Typography variant='subtitle2' sx={{}}>
                  よし！私はこの漫画「A」全巻を出品しよう！
                </Typography>               
              }
            />
            <Chip
              sx={{
                mt:'1rem',
                height: 'auto',
                pl: 0,
                '& .MuiChip-label': {
                  display: 'block',
                  whiteSpace: 'normal',
                  padding: '0.5rem',
                },
              }}
              label={
                <Typography variant='subtitle2' sx={{}}>
                  できれは、今読みたい漫画「B」か「C」と交換したいなあ
                </Typography>                
              }
            />
          </Box>
          <Box sx={{py:'1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant='h6' sx={{color:'red', fontWeight:'bold'}}>
              そんな時はマイ本棚に
            </Typography>
            <Typography variant='h6' sx={{color:'red', fontWeight:'bold'}}>
              欲しい漫画を登録しよう！
            </Typography>
          </Box>
            <Typography>
              出品画面にあなたの欲しい漫画が表示されて、マッチング率UP！！
            </Typography>
        </Box>
        <WishBookRegistSteps />
      </DialogContent>
      
      
      <DialogActions >
        <Button onClick={handleCloseDialog} color="primary">
          閉じる
        </Button>
      </DialogActions>
      </Dialog>
    </>
  );
};

export default BookListWish;
