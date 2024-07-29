import axios from 'axios';
import { authService } from '../api/authService';
import { updateGlobalAuthState } from '../components/context/AuthContext';
import { customNavigate } from './navigation';

console.log('http.tsxが読み込まれた。');
/*
axios.interceptors.response.use(
    response => {
      console.log('H1_Responseを受け取った。RefreshTokenは叩かれない。:', response);
      return response;
    },
    async error => {
      console.error('H2_何かしらErrorを受け取った。:', error.response);
      // 400 Bad Requestの場合、ログインページにリダイレクト
      if (error.response) {
        // 特定のエラー応答に基づく処理
        if (error.response.status === 400 || error.response.status === 500) {
          console.log('H_3 400もしくは500 例外だがログアウトを促す。');
          //updateGlobalAuthState({ isAuthenticated: false });
        } else if (error.response.status === 401) {
          try {
            await authService.refreshToken();
            console.log('H_4 Token refreshed successfully');
            history.go(0);
          } catch (refreshError) {
            console.error('H_5 リフレッシュトークンAPIを叩くことに失敗。ログインfalse状態に。:', refreshError);
            updateGlobalAuthState({ isAuthenticated: false });
            return Promise.reject(refreshError);
          }
        } else {
          console.error('H6_その他のエラー。ステータスコード:', error.response.status);
        }
      } else {
        console.error('H7_レスポンス無し:', error);
      }
      return Promise.reject(error);
    }
  );
  */
  axios.interceptors.response.use(
    response => {
      console.log('H1_Responseを受け取った。RefreshTokenは叩かれない。:', response);
      return response;
    },
    async error => {
      console.log('H2_何かしらErrorを受け取った。:', error.response);
  
      if (error.response) {
        if (error.response.status === 401) {
          console.log('H3_401エラー。ログインページに遷移します。');
          //updateGlobalAuthState({ isAuthenticated: false });
          customNavigate('/login-page/signup');
          return Promise.reject(error);
        } /*else {
          try {
            console.log('H4_401以外のエラー。リフレッシュトークンを試みます。');
            await authService.refreshToken();
            console.log('H5_Token refreshed successfully');
            return axios(error.config);
          } catch (error) {
            console.error('H6_リフレッシュトークンAPIを叩くことに失敗。:', error);
            updateGlobalAuthState({ isAuthenticated: false });
            //customNavigate('/login-page/signup');
            return Promise.reject(error);
          }
        }*/
      } else {
        console.error('H7_レスポンス無し:', error);
      }
      return Promise.reject(error);
    }
  );
  // ... 他のHTTP設定
