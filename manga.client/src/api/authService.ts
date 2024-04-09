import axios from 'axios';

export const authService = {
    refreshToken: async () => {
      console.log('Attempting to refresh token');
      try {
        const response = await axios.post(`https://localhost:7103/api/Users/RefreshToken`, {}, { withCredentials: true });
        console.log('Token refreshed successfully');
        return response.data;
      } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
      }
    },
    // ... 他の認証関連の関数
  };
