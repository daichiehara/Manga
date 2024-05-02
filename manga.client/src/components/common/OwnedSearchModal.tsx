import React, {useState} from 'react';
import { Box, Modal, Typography, Button, Fade, Paper, InputBase, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

interface OwnedSearchModalProps {
    onSearch: (query: string) => void;
    isOpen: boolean;
    onClose: () => void;
  
}

const OwnedSearchModal: React.FC<OwnedSearchModalProps> = ({ onSearch, isOpen, onClose }) => {
    const [query, setQuery] = useState('');  // 検索クエリのローカルステー
    // 検索を実行するハンドラー
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();  // フォーム送信によるページ再読み込みを防止
        onSearch(query);         // 検索クエリを親コンポーネントのハンドラーに渡す
    };

    // Modal content can be adjusted as needed
    const modalContent = (
        <Box sx={{
            // 一番外側のモーダルの形を整えるBox、コンテンツは一個内側のBoxを基本調整する。
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth:'640px',
        width: '95vw',  
        height:'80vh',
        bgcolor: '#F2F2F2',
        border: 'none',
        boxShadow: '0px 4px 5px -1px rgba(0,0,0,0.2)', 
        borderRadius: `20px`,
        zIndex:5000,
        }}>
            <Box sx={{p:1}}>
                <Button onClick={onClose} sx={{ pt: 1, justifyContent: 'flex-start' }}>
                    <CloseIcon />
                </Button>
                {/* 検索フォーム */}
                <Paper component="form" sx={{
                    mt:2,
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    boxShadow: '0px 4px 4px -1px rgba(0,0,0,0.2)',  // 軽い影を追加
                    borderRadius: '50px'  // ラウンドした形状
                    }} onSubmit={handleSearch}
                >
                    {/* 検索アイコン */}
                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    {/* 入力フィールド */}
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="タイトルまたは作者で検索"  // プレースホルダー
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}  // 入力値の変化に応じてステートを更新
                    />
                </Paper>
                <Box sx={{px:'2rem',height:'50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}>
                <Typography variant='h6' sx={{fontWeight:'bold', mt: 2 }}>
                    全巻持っている漫画を追加しよう! 
                </Typography>
                <Typography variant='subtitle2' sx={{fontWeight:'bold', mt: 2 }}>
                    検索であなたの漫画を欲しい人が見つかりやすくなります!
                </Typography>
                <Typography variant='subtitle1' sx={{fontWeight:'bold', mt: 2 }}>
                    
                </Typography>
                </Box>
            </Box>
        </Box>
  );

  return (
    <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        slotProps={{
        backdrop: {
            style: {
            backgroundColor: 'transparent',  // Make the backdrop transparent
            boxShadow: 'none'  // Remove any shadow effects from the backdrop
            }
        }
        }}

    >
      <Fade in={isOpen}>
        {modalContent}
      </Fade>
    </Modal>
  );
};

export default OwnedSearchModal;
