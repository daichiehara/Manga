// AxiosInterceptorProvider.tsx
import React, { createContext, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';
import { AuthContext } from '../../components/context/AuthContext';

const AxiosInterceptorContext = createContext<null>(null);

export const useAxiosInterceptor = () => useContext(AxiosInterceptorContext);


export const AxiosInterceptorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { updateAuthState } = useContext(AuthContext);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => {
        console.log('H1_Responseを受け取った。RefreshTokenは叩かれない。:', response);
        return response;
      },
      async error => {
        console.log('H2_何かしらErrorを受け取った。:', error.response);

        if (error.response) {
          if (error.response.status === 401) {
            console.log('H3_401エラー。ログインページに遷移します。');
            updateAuthState({ isAuthenticated: false });
            navigate('/signup');
            return Promise.reject(error);
          }
          // 他のエラー処理をここに追加
        } else {
          console.error('H7_レスポンス無し:', error);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate, updateAuthState]);

  return (
    <AxiosInterceptorContext.Provider value={null}>
      {children}
    </AxiosInterceptorContext.Provider>
  );
};
