import React, { useState, useEffect, useContext, useCallback } from 'react';
import TabsComponent from '../components/common/TabsComponent';
import MangaListItem from '../components/item/MangaListItem';
import Header from '../components/common/Header';
//import MangaImage1 from '../assets/images/MangaImage1.jpg';
import MenuBar from '../components/menu/MenuBar';
import axios from 'axios';

interface MainSearch {
  sellId: number;
  sellTitle: string;
  numberOfBooks: number;
  wishTitles: {
    title: string;
    isOwned: boolean;
  }[];
  sellImage: string;
}

const MainSearch: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [mangaData, setMangaData] = useState<MainSearch[]>([]); 

  // 新しいステートの追加
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMangaData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://localhost:7103/api/Sells', {
          withCredentials: true
        });
        setMangaData(response.data);
      } catch (error) {
        console.error('データ取得に失敗しました:', error);
        setError('データのロードに失敗しました');
      } finally {
        setLoading(false);
      }
    };
  
    fetchMangaData();
  }, []);  // 空の依存配列を使用して、コンポーネントのマウント時にのみ実行

  const handleSearch = useCallback((query: string) => {
    // 検索処理
  }, []);  // 依存配列が空なので、コンポーネントのライフタイムで一度だけ生成される

  // タブが変更されたときに呼び出される関数
  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  }, []);

  const MemoizedMangaListItem = React.memo(MangaListItem);


  return (
    <>
      <Header onSearch={handleSearch} />
      
      <TabsComponent selectedTab={selectedTab} onTabChange={handleTabChange} />
      <div style={{ marginTop: 140,/* Tabsの内容の高さに合わせて調整 */ paddingBottom:'6rem'}}>
      
      {/* データ取得中のインジケーター */}
      {loading && <div>ローディング中...</div>}
      {/* エラーメッセージ */}
      {error && <div>{error}</div>}
      {/* メインコンテンツ */}
      {selectedTab === 0 && (
        mangaData.map((item, index) => (
          <MangaListItem 
            key={index}
            sellId={item.sellId}
            sellImage={item.sellImage} 
            sellTitle={item.sellTitle} 
            numberOfBooks={item.numberOfBooks}
            wishTitles={item.wishTitles} // 修正
          />
        ))
      )}
      {selectedTab === 1 && (
        // "MyList" タブのコンテンツ
        <div>MyList content goes here...</div>
      )}
      </div>
      
      <MenuBar />
    </>
  );
};

export default MainSearch;
