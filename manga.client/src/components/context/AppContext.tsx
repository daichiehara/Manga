import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

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

interface AppContextType {
  mangaData: MainSearch[];
  myListData: MainSearch[];
  recommendData: MainSearch[];
  isLoadingManga: boolean;
  isLoadingMyList: boolean;
  isLoadingRecommend: boolean;
  error: string | null;
}

export const AppContext = createContext<AppContextType>({
  mangaData: [],
  myListData: [],
  recommendData: [],
  isLoadingManga: false,
  isLoadingMyList: false,
  isLoadingRecommend: false,
  error: null,
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mangaData, setMangaData] = useState<MainSearch[]>([]);
  const [myListData, setMyListData] = useState<MainSearch[]>([]);
  const [recommendData, setRecommendData] = useState<MainSearch[]>([]);
  const [isLoadingManga, setIsLoadingManga] = useState(false);
  const [isLoadingMyList, setIsLoadingMyList] = useState(false);
  const [isLoadingRecommend, setIsLoadingRecommend] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!authState.isInitialized || !authState.isAuthenticated) return;

      setIsLoadingRecommend(true);
      setIsLoadingManga(true);
      setIsLoadingMyList(true);

      try {
        const [recommendResponse, mangaResponse, myListResponse] = await Promise.all([
          axios.get('https://localhost:7103/api/Sells/Recommend', { withCredentials: true }),
          axios.get('https://localhost:7103/api/Sells', { withCredentials: true }),
          axios.get('https://localhost:7103/api/Sells/MyFavorite', { withCredentials: true })
        ]);

        setRecommendData(recommendResponse.data);
        setMangaData(mangaResponse.data);
        setMyListData(myListResponse.data);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
        setError('データのロードに失敗しました');
      } finally {
        setIsLoadingRecommend(false);
        setIsLoadingManga(false);
        setIsLoadingMyList(false);
      }
    };

    fetchData();
  }, [authState.isInitialized, authState.isAuthenticated]);

  return (
    <AppContext.Provider value={{ 
        mangaData, 
        myListData, 
        recommendData, 
        isLoadingManga, 
        isLoadingMyList, 
        isLoadingRecommend,  error }}>
      {children}
    </AppContext.Provider>
  );
};