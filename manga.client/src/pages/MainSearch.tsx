import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import NavigationBar from '../components/navigation/NavigationBar';
import MangaListItem from '../components/manga/MangaListItem';
import SearchBar from '../components/common/SearchBar';

// 仮のマンガデータ
const mangaData = [
    {
      imageUrl: '/path/to/image1.jpg',
      title: 'ONE PIECE',
      description: '海賊の冒険物語',
    },
    // 他のマンガのデータを追加...
  ];  

const MainSearch: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleSearch = (query: string) => {
      console.log(query); // ここで検索処理を実装します。今はコンソールに表示するだけです。
    };

    const handleTabChange = (_: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedTab(newValue);
      };

    return (
      <>
        <SearchBar onSearch={handleSearch} />
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label="Recommend" />
            <Tab label="MyList" />
          </Tabs>
        </Box>
        {selectedTab === 0 && (
          // "Recommend" タブのコンテンツ
          mangaData.map(manga => (
            <MangaListItem key={manga.title} {...manga} />
          ))
        )}
        {selectedTab === 1 && (
          // "MyList" タブのコンテンツ
          <div>MyList content goes here...</div>
        )}
        <NavigationBar />
        </>
  );
};

export default MainSearch;
