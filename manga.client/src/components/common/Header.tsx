import React, { useState, memo } from 'react';
import { AppBar, Toolbar, InputBase, Paper, IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // ページの再読み込みを防ぐ
    onSearch(query);
  };

  return (
    <AppBar position="fixed" sx={{
       
        mb: 2, // 下のマージン
        background: 'linear-gradient(to right, #E97132, #F2CFEE)', // グラデーションの背景色
        boxShadow: 'none',maxWidth: '640px',width: '100%', left: '50%',transform: 'translateX(-50%)',
      }}>
      <Toolbar disableGutters sx={{mt: 3, mb: 0.5, px:2,}}>
        <Paper
          component="form"
          sx={{
            
            display: 'flex',
            alignItems: 'center',
            width: '100%', // モバイルでの表示調整
            boxShadow: '0px 4px 4px -1px rgba(0,0,0,0.2)',
            margin: 'auto', // 中央揃え
            borderRadius: '5px'
          }}
          onSubmit={handleSearch}
        >
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>

          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="欲しい漫画を探す"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          
        </Paper>
      </Toolbar>
    </AppBar>
  );
};

export default memo(SearchBar);  // React.memo でコンポーネントをメモ化
