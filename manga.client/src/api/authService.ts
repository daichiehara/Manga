import axios, { AxiosError } from 'axios';
import { updateGlobalAuthState } from '../components/context/AuthContext';

export const authService = {
  refreshToken: async () => {
    console.log('a_1 リフレッシュトークンにトライ');
    try {
      const response = await axios.post(`https://localhost:7103/api/Users/RefreshToken`, {}, { withCredentials: true });
      console.log('a_2 リフレッシュトークンのapiを叩いた:', response.data);
      updateGlobalAuthState({ isAuthenticated: true }); // 認証状態を更新
      return response.data;
    } catch (error) {
      // エラーがAxiosError型かどうかをチェック
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('a_3 リフレッシュトークンのリクエストに失敗:', axiosError.response ? axiosError.response.data : axiosError.message);
        updateGlobalAuthState({ isAuthenticated: false });
      } else {
        console.error('a_3 不明なエラー:', error);
        updateGlobalAuthState({ isAuthenticated: false });
      }
      throw error;
    }
  },
  logout: async () => {
    try {
      // サーバーにログアウトリクエストを送信（必要に応じて）
      await axios.post(`https://localhost:7103/api/Users/Logout`, {}, { withCredentials: true });

      // クライアントの認証情報をクリア
      updateGlobalAuthState({ isAuthenticated: false });
      console.log(`ログアウト処理が実行されました`)
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
      throw error;
    }
  }
};

