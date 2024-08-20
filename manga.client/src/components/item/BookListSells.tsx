import React, { useState, useCallback, memo } from 'react';
import { List, ListItem, ListItemText, IconButton, Collapse, Typography, Box, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { TransitionGroup } from 'react-transition-group';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AddIcon from '@mui/icons-material/Add';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface Book {
  itemId: number;
  title: string;
}

interface BookListSellsProps {
  title: string;
  books: Book[];
}

const BookListSells: React.FC<BookListSellsProps> = React.memo(({ title, books }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleSearch = useCallback((query: string) => {
    // 検索処理の例（現在は無効化）
  }, []);

  return (
    <div>
      <Box sx={{ pt:'2rem', display: 'flex', alignItems: 'center',}}>
        <RocketLaunchIcon sx={{ fontsize:'1rem',mr: 1, alignSelf: 'center', color: '#EB4848' }}/>
        <Box sx={{display: 'flex', flexDirection: 'column',}}>
          <Typography variant="subtitle1" sx={{fontWeight: 'bold', color: '#757575'}}>
            {title}
          </Typography>
        </Box>
      </Box>
      
      <List>
        <TransitionGroup>
          {books.map((book) => (
            <Collapse key={book.itemId}> 
              <ListItem
               
              >
                <ListItemText primary={book.title} />
              </ListItem>
              <Divider sx={{ width: '100%' }}/>
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <Box sx={{py:'1rem', display:'flex', justifyContent:'center'}}>
          <RocketLaunchIcon sx={{ fontsize:'1rem',mr: 1, alignSelf: 'center', color: '#EB4848' }}/>
          <Box sx={{display: 'flex', flexDirection: 'column',}}>
            <Typography variant="subtitle1" sx={{fontWeight: 'bold', color: '#757575'}}>
              販売の準備 {/* ダイアログのタイトル */}
            </Typography>
          </Box>
        </Box>
        <DialogContent sx={{pt:0}}>
          <Box sx={{py:'1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant='subtitle1' sx={{color:'red', fontWeight:'bold'}}>
              販売リストに追加しましょう！
            </Typography>
          </Box>
          <Typography>
            あなたが販売中の漫画をまずはリストに追加しましょう。購入者が検索しやすくなります。
          </Typography>
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

export default BookListSells;
