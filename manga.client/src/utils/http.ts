import axios from 'axios';
import { authService } from '../api/authService';
import { updateGlobalAuthState } from '../components/auth/AuthContext';

console.log('http.tsxが読み込まれた。');
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
            console.error('H_5 リフレッシュトークンAPIを叩くことに失敗。:', refreshError);
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
  
  // ... 他のHTTP設定
