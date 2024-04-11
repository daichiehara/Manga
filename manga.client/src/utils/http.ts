import axios from 'axios';
import { authService } from '../api/authService';
import { updateGlobalAuthState } from '../components/auth/AuthContext';

console.log('http.tsxが読み込まれた。');
axios.interceptors.response.use(
    response => {
      console.log('H1_Responseを受け取った。:', response);
      return response;
    },
    async error => {
      console.error('H2_何かしらErrorを受け取った。:', error.response);
      // 400 Bad Requestの場合、ログインページにリダイレクト
      if (error.response.status === 400) {
        console.log('H_3 本来はログインページ');
      }
      if (error.response.status === 401) {
        try {
          await authService.refreshToken();
          console.log('H_4Token refreshed successfully');
          
          history.go(0);
          //本来はlogin関数とかで認証状態に？
        } catch (refreshError) {
          console.error('H_5リフレッシュトークンに弾かれた。本来はログインページへ。:', refreshError);
          updateGlobalAuthState({ isAuthenticated: false }); // 認証状態をリセット
          // ログインページへ？
          return Promise.reject(refreshError);
        }
      
      }
      else {
        console.error('H_例外');
      }
      return Promise.reject(error);
    }
);
  
  // ... 他のHTTP設定
