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
  fetchMoreData: (tabIndex: number) => Promise<void>;
  hasMore: { [key: number]: boolean };
}

export const AppContext = createContext<AppContextType>({
  mangaData: [],
  myListData: [],
  recommendData: [],
  isLoadingManga: false,
  isLoadingMyList: false,
  isLoadingRecommend: false,
  error: null,
  fetchMoreData: async () => {},
  hasMore: { 0: false, 1: false, 2: false }
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
  const [page, setPage] = useState<{ [key: number]: number }>({ 0: 1, 1: 1, 2: 1 });
  const [hasMore, setHasMore] = useState<{ [key: number]: boolean }>({ 0: true, 1: true, 2: true });

  const fetchData = async (tabIndex: number, isInitialLoad: boolean = false) => {
    if (!authState.isInitialized || !authState.isAuthenticated) return;

    const setLoading = (tabIndex: number, value: boolean) => {
      if (tabIndex === 0) setIsLoadingMyList(value);
      else if (tabIndex === 1) setIsLoadingRecommend(value);
      else if (tabIndex === 2) setIsLoadingManga(value);
    };

    setLoading(tabIndex, true);

    try {
      let url;
      if (tabIndex === 0) url = 'https://localhost:7103/api/Sells/MyFavorite';
      else if (tabIndex === 1) url = 'https://localhost:7103/api/Sells/Recommend';
      else url = 'https://localhost:7103/api/Sells';

      const response = await axios.get(url, {
        params: { page: page[tabIndex], pageSize: 10 },
        withCredentials: true
      });

      const newData = response.data;
      const setDataFunction = tabIndex === 0 ? setMyListData : tabIndex === 1 ? setRecommendData : setMangaData;

      setDataFunction(prevData => isInitialLoad ? newData : [...prevData, ...newData]);
      setHasMore(prev => ({ ...prev, [tabIndex]: newData.length === 10 }));
      setPage(prev => ({ ...prev, [tabIndex]: prev[tabIndex] + 1 }));
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
      setError('データのロードに失敗しました');
    } finally {
      setLoading(tabIndex, false);
    }
  };

  const fetchMoreData = async (tabIndex: number) => {
    if (hasMore[tabIndex]) {
      await fetchData(tabIndex);
    }
  };

  useEffect(() => {
    if (authState.isInitialized && authState.isAuthenticated) {
      fetchData(0, true);
      fetchData(1, true);
      fetchData(2, true);
    }
  }, [authState.isInitialized, authState.isAuthenticated]);

  return (
    <AppContext.Provider value={{ 
        mangaData, 
        myListData, 
        recommendData, 
        isLoadingManga, 
        isLoadingMyList, 
        isLoadingRecommend,
        error,
        fetchMoreData,
        hasMore
        }}>
      {children}
    </AppContext.Provider>
  );
};