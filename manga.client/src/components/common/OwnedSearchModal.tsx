import React, { useState } from 'react';
import { Box, Typography, Button, Fade, Paper, InputBase, IconButton, SwipeableDrawer } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

interface OwnedSearchModalProps {
    onSearch: (query: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const OwnedSearchModal: React.FC<OwnedSearchModalProps> = ({ onSearch, isOpen, onClose }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch(query);
    };

    const modalContent = (
        <Box sx={{
            maxWidth: '640px',
            width: '100%',  
            height: '85vh',
            bgcolor: 'background.paper',
            borderRadius: `20px`,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{p:1}}>
                <Button onClick={onClose} sx={{ pt: 1, justifyContent: 'flex-start' }}>
                    <CloseIcon />
                </Button>
                <Paper component="form" sx={{
                    mt:2,
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    borderRadius: '50px',
                    boxShadow:`none`,
                    border: '0.8px solid #bfbfbf',
                    }} onSubmit={handleSearch}
                >
                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="タイトルまたは作者で検索"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </Paper>
                <Box sx={{pt:'25vh',px:'2rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}>
                    <Typography variant='h6' sx={{color:`red`, fontWeight:'bold'}}>
                        全巻持っている漫画を追加しよう! 
                    </Typography>
                    <Typography variant='subtitle1' sx={{pt:1,fontWeight:'bold'}}>
                        検索であなたの漫画を欲しい人が
                    </Typography>
                    <Typography variant='subtitle1' sx={{fontWeight:'bold'}}>
                        見つかりやすくなります!
                    </Typography>
                </Box>
            </Box>
        </Box>
    );

    return (
        <SwipeableDrawer
        disableScrollLock //、これを有効にすることでページの
        anchor='bottom'
        open={isOpen}
        onOpen={() => {}}
        onClose={onClose}
        swipeAreaWidth={0}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,  // Keep the component mounted after it's been displayed once
        }}
        sx={{
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            width: '100vw', // 画面の幅にフルで広げる// Allows the width to grow with content up to maxWidth
            maxWidth: '640px',  // Maximum width set to 640px
            mx: 'auto',
          }
        }}
      >


            <Fade in={isOpen}>
                {modalContent}
            </Fade>
        </SwipeableDrawer>
    );
};

export default OwnedSearchModal;
