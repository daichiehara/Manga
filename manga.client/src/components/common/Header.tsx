import React, { useState, memo } from 'react';
import { AppBar, Toolbar, InputBase, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TabsComponent from './TabsComponent';

// 検索バーとタブを持つコンポーネントのPropsの型定義
interface HeaderProps {
  onSearch: (query: string) => void;
  selectedTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

// 検索バーとタブコンポーネントの実装
const Header: React.FC<HeaderProps> = ({ onSearch, selectedTab, onTabChange }) => {
  const [query, setQuery] = useState('');  // 検索クエリのローカルステート

  // 検索を実行するハンドラー
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();  // フォーム送信によるページ再読み込みを防止
    onSearch(query);         // 検索クエリを親コンポーネントのハンドラーに渡す
  };

  return (
    // AppBar コンポーネントは検索バーを含むツールバーとタブを表示
    <AppBar position="fixed" sx={{
      pb: '0rem',
      //background: 'linear-gradient(to right, #fce2c4, orange)',
      background:'#53A422',
      //background:'#759A5E',
      boxShadow: 'none',  // 影を消去
      maxWidth: '640px',
      width: '100%',
      left: '50%',
      transform: 'translateX(-50%)',  // 中央に配置
    }}>
      <Toolbar disableGutters sx={{ width: 'auto', mt: '1rem', mb: 0, px: 1 }}>
        {/* 検索フォーム */}
        <Paper component="form" sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          boxShadow: 'none',  // 軽い影を追加
          margin: 'auto',
          borderRadius: '5px'  // ラウンドした形状
        }} onSubmit={handleSearch}>
          {/* 検索アイコン */}
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
          {/* 入力フィールド */}
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Tocaeru.comで検索"  // プレースホルダー
            value={query}
            onChange={(e) => setQuery(e.target.value)}  // 入力値の変化に応じてステートを更新
          />
        </Paper>
      </Toolbar>
      {/* タブコンポーネント */}
      <TabsComponent selectedTab={selectedTab} onTabChange={onTabChange} />
    </AppBar>
  );
};

// パフォーマンス最適化のためにReact.memoでコンポーネントをラップ
export default memo(Header);
