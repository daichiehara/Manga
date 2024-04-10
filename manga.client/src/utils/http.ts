import axios from 'axios';
import { authService } from '../api/authService';

console.log('http.tsxが読み込まれた。');

axios.interceptors.response.use(
    response => {
      console.log('Response received:', response);
      return response;
    },
    async error => {
      console.error('Error response:', error.response);
      if (error.response.status === 401) {
        // 期限切れだったら401が返される
        try {
          await authService.refreshToken();
          console.log('Token refreshed successfully');
          history.go(0);
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          // ログアウトの処理をここに実装する
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
);
  
  // ... 他のHTTP設定
