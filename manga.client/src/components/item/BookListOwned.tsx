import React, { useState, useEffect, useCallback, memo } from 'react';
import { List, ListItem, ListItemText, IconButton, Chip, Collapse, Typography, Box, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { TransitionGroup } from 'react-transition-group';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AddIcon from '@mui/icons-material/Add';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import OwnedSearchModal from '../common/OwnedSearchModal';
import OwnedBookRegistSteps from './OwnedBookRegistSteps';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    onRefreshOwnedList();
  };

  const handleOpenDialog = () => setIsDialogOpen(true);   // ダイアログを開く
  const handleCloseDialog = () => setIsDialogOpen(false); // ダイアログを閉じる

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
        <IconButton onClick={handleOpenDialog}>  {/* ダイアログを開く */}
          <HelpOutlineIcon sx={{ fontsize: '3rem', ml: 1, alignSelf: 'center', color: '#BFBFBF' }} />
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
          {books.map((book, index) => (
            <Collapse key={book.itemId || index}> 
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
      {/* ダイアログ */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <Box sx={{py:'1rem', display:'flex', justifyContent:'center'}}>
          <RocketLaunchIcon sx={{ fontsize:'1rem',mr: 1, alignSelf: 'center', color: '#EB4848' }}/>
          <Box sx={{display: 'flex', flexDirection: 'column',}}>
            <Typography variant="subtitle1" sx={{fontWeight: 'bold', color: '#757575'}}>
              とりあえず登録
            </Typography>
          </Box>
        </Box>
        <DialogContent sx={{pt:0, px:0}}>
          <Box sx={{px:2}}>
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
                    まずは何をすればいいんだろう？
                  </Typography>
                }
              />
            </Box>
            <Box sx={{py:'1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography variant='h5' sx={{color:'black', fontWeight:'bold'}}>
                まずやってみよう！！
              </Typography>
              <Typography variant='h5' sx={{color:'red', fontWeight:'bold'}}>
                とりあえず登録
              </Typography>
            </Box>
            <Typography>
              あなたが全巻持っている漫画をまずはマイ本棚に登録しましょう。検索時に、あなたの漫画とマッチしている出品が見つけやすくなります。
            </Typography>
          </Box>
          <OwnedBookRegistSteps />
        </DialogContent>
        <DialogActions >
          <Button onClick={handleCloseDialog} color="primary">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
});

export default BookListOwned;
