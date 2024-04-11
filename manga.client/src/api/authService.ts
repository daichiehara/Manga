import axios, { AxiosError } from 'axios';

export const authService = {
  refreshToken: async () => {
    console.log('a_1 リフレッシュトークンにトライ');
    try {
      const response = await axios.post(`https://localhost:7103/api/Users/RefreshToken`, {}, { withCredentials: true });
      console.log('a_2 トークンが正常にリフレッシュされました:', response.data);
      return response.data;
    } catch (error) {
      // エラーがAxiosError型かどうかをチェック
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('a_3 リフレッシュトークンのリクエストに失敗:', axiosError.response ? axiosError.response.data : axiosError.message);
      } else {
        console.error('a_3 不明なエラー:', error);
      }
      throw error;
    }
  },
  // ... 他の認証関連の関数
};
