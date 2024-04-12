import {  useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import CustomToolbar from '../components/common/CustumToolbar';
import React, { useState, useEffect, useContext } from 'react';
import MenuBar from '../components/menu/MenuBar';
import axios from 'axios';
import { AuthContext } from '../components/auth/AuthContext';
import MangaListItem from '../components/item/MangaListItem';


interface MainMpFavoList {
  sellId: number;
  sellTitle: string;
  numberOfBooks: number;
  wishTitles: {
    title: string;
    isOwned: boolean;
  }[];
  sellImage: string;
  title: string; 
}

const MainMpFavoList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab] = useState(0);
  const [mangaData, setMangaData] = useState<MainMpFavoList[]>([]); 
  const handleBack = () => {
    navigate(-1); // 前のページに戻る
  };

    // AuthContextから認証状態を安全に取得
    const authContext = useContext(AuthContext);
    const isAuthenticated = authContext ? authContext.authState.isAuthenticated : false;
  
    useEffect(() => {
      
      console.log('ログイン状態:', isAuthenticated); // ログイン状態をコンソールに表示
  
      const fetchMangaData = async () => {
        try {
          console.log('APIリクエストを送信中...');
          const response = await axios.get('https://localhost:7103/api/Sells/MyFavorite', {
            withCredentials: true  // クロスオリジンリクエストにクッキーを含める
          });
          console.log('レスポンス受信:', response.status, response.statusText);
          console.log('取得したデータ:', response.data);
          console.log('ログイン状態:', isAuthenticated); // ログイン状態をコンソールに表示
          setMangaData(response.data);
        } catch (error) {
          console.error('データ取得に失敗しました:', error);
        }
      };
  
      fetchMangaData();
    }, [isAuthenticated]); // 空の依存配列を指定して、コンポーネントのマウント時にのみ実行


  return (
    <>
      {/* 見出しのToolbar */}
      <CustomToolbar title='いいね！一覧'/>    
      {/* 戻るボタン */}
      <BackButton handleBack={handleBack} />

      <div style={{ marginTop: 145,/* Tabsの内容の高さに合わせて調整 */ paddingBottom:'6rem'}}>
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

export default MainMpFavoList;
