import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

interface MainMyPage {
  title: string;
  nickName: string;
  profileIcon: string;
  hasIdVerificationImage: boolean;
}

interface UserContextType {
  userInfo: MainMyPage | null;
  refreshUserInfo: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  userInfo: null,
  refreshUserInfo: async () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<MainMyPage | null>(null);
  const { authState } = useContext(AuthContext);

  const fetchUserInfo = async () => {
    if (!authState.isAuthenticated) return;

    try {
      const response = await axios.get<MainMyPage>('https://localhost:7103/api/Users/MyPage', {
        withCredentials: true
      });
      setUserInfo(response.data);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    } catch (error) {
      console.error('ユーザー情報の取得に失敗しました。', error);
    }
  };

  const refreshUserInfo = async () => {
    await fetchUserInfo();
  };

  useEffect(() => {
    const cachedUserInfo = localStorage.getItem('userInfo');
    if (cachedUserInfo) {
      setUserInfo(JSON.parse(cachedUserInfo));
    }

    if (authState.isAuthenticated) {
      fetchUserInfo();
    }
  }, [authState.isAuthenticated]);

  return (
    <UserContext.Provider value={{ userInfo, refreshUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};