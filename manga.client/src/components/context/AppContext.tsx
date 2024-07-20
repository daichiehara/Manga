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
  isLoading: boolean;
  error: string | null;
}

export const AppContext = createContext<AppContextType>({
  mangaData: [],
  myListData: [],
  recommendData: [],
  isLoading: false,
  error: null,
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mangaData, setMangaData] = useState<MainSearch[]>([]);
  const [myListData, setMyListData] = useState<MainSearch[]>([]);
  const [recommendData, setRecommendData] = useState<MainSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!authState.isInitialized || !authState.isAuthenticated) return;

      setIsLoading(true);
      try {
        const [mangaResponse, myListResponse, recommendResponse] = await Promise.all([
          axios.get('https://localhost:7103/api/Sells', { withCredentials: true }),
          axios.get('https://localhost:7103/api/Sells/MyFavorite', { withCredentials: true }),
          axios.get('https://localhost:7103/api/Sells/Recommend', { withCredentials: true })
        ]);

        setMangaData(mangaResponse.data);
        setMyListData(myListResponse.data);
        setRecommendData(recommendResponse.data);
      } catch (error) {
        console.error('データ取得に失敗しました:', error);
        setError('データのロードに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [authState.isInitialized, authState.isAuthenticated]);

  return (
    <AppContext.Provider value={{ mangaData, myListData, recommendData, isLoading, error }}>
      {children}
    </AppContext.Provider>
  );
};