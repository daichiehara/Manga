import React, { useState, useEffect } from 'react';
import TabsComponent from '../components/common/TabsComponent';
import NavigationBar from '../components/navigation/NavigationBar';
import MangaListItem from '../components/manga/MangaListItem';
import Header from '../components/common/Header';
import MangaImage1 from '../assets/images/MangaImage1.jpg';

const MainSearch: React.FC = () => {
    const [selectedTab] = useState(0);
    const [mangaData, setMangaData] = useState([]);

    useEffect(() => {
      const fetchMangaData = async () => {
        try {
          console.log('APIリクエストを送信中...');
          const response = await fetch(`/api/Sells`);
          console.log('レスポンス受信:', response.status, response.statusText);
          const data = await response.json();
          console.log('取得したデータ:', data);
          setMangaData(data);
        } catch (error) {
          console.error('データの取得に失敗しました:', error);
        }
      };
  
      fetchMangaData();
    }, []); // 空の依存配列を指定して、コンポーネントのマウント時にのみ実行

    const handleSearch = (query: string) => {
      console.log(query); // ここで検索処理を実装します。今はコンソールに表示するだけです。
    };

    return (
      <>
        <Header onSearch={handleSearch} />
        <TabsComponent />
        <div style={{ marginTop: 120/* Tabsの高さに合わせて調整 */ }}></div>
        {/* メインコンテンツ */}
        {selectedTab === 0 && (
          mangaData.map((manga, index) => (
            <MangaListItem 
              key={index}
              sellImage={manga.sellImage} 
              sellTitle={manga.sellTitle} 
              numberOfBooks={manga.numberOfBooks}
              wishTitles={manga.wishTitles} // 修正
            />
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
