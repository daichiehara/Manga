import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { API_BASE_URL } from '../../apiName';

enum SellStatus {
  Recruiting = 1,
  Suspended = 2,
  Establish = 3,
  Draft = 4,
}
interface MainSearch {
    sellId: number;
    sellTitle: string;
    numberOfBooks: number;
    sellStatus: SellStatus;
    
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
  refreshMyFavorite: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}

interface GuestOwnedBook {
  itemId: number;
  title: string;
}

interface FetchParams {
  page: number;
  pageSize: number;
  guestOwnedTitles?: string[];
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
  hasMore: { 0: false, 1: false, 2: false },
  refreshMyFavorite: async () => {},
  refreshAllData: async () => {},
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

  const resetState = useCallback(() => {
    console.log('リセット開始');
    setMangaData([]);
    setMyListData([]);
    setRecommendData([]);
    setPage({ 0: 1, 1: 1, 2: 1 });
    setHasMore({ 0: true, 1: true, 2: true });
    setError(null);
    console.log('リセット完了');
  }, []);

  const fetchData = useCallback(async (tabIndex: number, isInitialLoad: boolean = false, currentPage: number) => {
    if (!authState.isInitialized) return;
    console.log(`fetchData開始: tabIndex=${tabIndex}, isInitialLoad=${isInitialLoad}, currentPage=${currentPage}`);

    const setLoading = (tabIndex: number, value: boolean) => {
      if (tabIndex === 0) setIsLoadingMyList(value);
      else if (tabIndex === 1) setIsLoadingRecommend(value);
      else if (tabIndex === 2) setIsLoadingManga(value);
    };

    setLoading(tabIndex, true);

    try {
      let url: string;
      let params: FetchParams = { page: currentPage, pageSize: 10 };

      if (tabIndex === 0) url = `${API_BASE_URL}/Sells/MyFavorite`;
      else if (tabIndex === 1) url = `${API_BASE_URL}/Sells/Recommend`;
      else url = `${API_BASE_URL}/Sells`;

      if (!authState.isAuthenticated && tabIndex !== 0) {
        // ゲストユーザーの場合、ローカルストレージのデータを取得し、タイトルのみの配列に変換
        const guestOwnedBooks: GuestOwnedBook[] = JSON.parse(localStorage.getItem('guestMangaList') || '[]');
        const guestOwnedTitles = guestOwnedBooks.map(book => book.title);
        params = { ...params, guestOwnedTitles };
      }

      const response = await axios.get(url, {
        params,
        withCredentials: true
      });

      const newData = response.data;
      const setDataFunction = tabIndex === 0 ? setMyListData : tabIndex === 1 ? setRecommendData : setMangaData;

      setDataFunction(prevData => isInitialLoad ? newData : [...prevData, ...newData]);
      setHasMore(prev => ({ ...prev, [tabIndex]: newData.length === 10 }));
      setPage(prev => ({ ...prev, [tabIndex]: currentPage + 1 }));

      console.log(`fetchData完了: tabIndex=${tabIndex}, newPage=${currentPage + 1}`);
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
      setError('データのロードに失敗しました');
    } finally {
      setLoading(tabIndex, false);
    }
  }, [authState.isInitialized]);

  const fetchMoreData = useCallback(async (tabIndex: number) => {
    if (hasMore[tabIndex]) {
      await fetchData(tabIndex, false, page[tabIndex]);
    }
  }, [hasMore, fetchData, page]);

  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      if (authState.isInitialized && isMounted) {
        console.log('fetchAllData開始');
        resetState();
        
        // 状態更新が反映されるのを待つ
        await new Promise(resolve => setTimeout(resolve, 0));
        
        if (isMounted) {
          console.log('Current page state:', page);
          await fetchData(0, true, 1);
          if (isMounted) await fetchData(1, true, 1);
          if (isMounted) await fetchData(2, true, 1);
        }
        console.log('fetchAllData完了');
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, [authState.isInitialized, authState.isAuthenticated]);

  const refreshMyFavorite = useCallback(async () => {
    setIsLoadingMyList(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/Sells/MyFavorite`, {
        params: { page: 1, pageSize: 10 },
        withCredentials: true
      });
      setMyListData(response.data);
      setHasMore(prev => ({ ...prev, 0: response.data.length === 10 }));
      setPage(prev => ({ ...prev, 0: 2 }));
    } catch (error) {
      console.error('MyFavoriteの取得に失敗しました:', error);
      setError('MyFavoriteのロードに失敗しました');
    } finally {
      setIsLoadingMyList(false);
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    console.log('全データの更新を開始');
    setIsLoadingManga(true);
    setIsLoadingMyList(true);
    setIsLoadingRecommend(true);

    try {
      await Promise.all([
        fetchData(0, true, 1),  // MyFavorite
        fetchData(1, true, 1),  // Recommend
        fetchData(2, true, 1),  // Manga
      ]);
      console.log('全データの更新が完了しました');
    } catch (error) {
      console.error('データの更新中にエラーが発生しました:', error);
      setError('データの更新に失敗しました');
    } finally {
      setIsLoadingManga(false);
      setIsLoadingMyList(false);
      setIsLoadingRecommend(false);
    }
  }, [fetchData]);



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
        hasMore,
        refreshMyFavorite,
        refreshAllData,
        }}>
      {children}
    </AppContext.Provider>
  );
};