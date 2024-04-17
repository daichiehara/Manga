import axios, { AxiosError } from 'axios';
import { updateGlobalAuthState } from '../components/context/AuthContext';
import { addGlobalBook, removeGlobalBook } from '../components/context/BookContext';

interface Book {
  id: string;
  title: string;
}

interface BooksApiResponse {
  ownedLists: Book[];
  sells: Book[];
}

type BookId = string; // `bookId`は文字列型ですが、意味の明確化のために型エイリアスを使用しています。


const API_BASE_URL = 'https://localhost:7103/api';

export const bookService = {
  getBooks: async () => {
    try {
      const response = await axios.get<BooksApiResponse>(`${API_BASE_URL}/Users/OwnedLists`, { withCredentials: true });
      console.log('Book data fetched:', response.data);
      response.data.ownedLists.forEach(book => addGlobalBook(book));  // ownedListsを状態に反映
      response.data.sells.forEach(book => addGlobalBook(book));      // sellsも状態に反映
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  addBook: async (book: Book) => {
    try {
      const response = await axios.post<Book>(`${API_BASE_URL}/Users/AddBook`, book, { withCredentials: true });
      console.log('Book added:', response.data);
      addGlobalBook(response.data); // 新しい本を状態に追加
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  removeBook: async (bookId: BookId) => {
    try {
      await axios.delete(`${API_BASE_URL}/Users/RemoveBook/${bookId}`, { withCredentials: true });
      console.log('Book removed:', bookId);
      removeGlobalBook(bookId); // 本を状態から削除
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
};

// エラーハンドリング共通関数
function handleError(error:unknown) {
  if (axios.isAxiosError(error)) {
    console.error('API request failed:', error.response ? error.response.data : error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}

export const authService = {
  refreshToken: async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Users/RefreshToken`, {}, { withCredentials: true });
      console.log('Refresh token received:', response.data);
      updateGlobalAuthState({ isAuthenticated: true });
      return response.data;
    } catch (error) {
      handleError(error);
      updateGlobalAuthState({ isAuthenticated: false });
      throw error;
    }
  },
  logout: async () => {
    try {
      await axios.post(`${API_BASE_URL}/Users/Logout`, {}, { withCredentials: true });
      updateGlobalAuthState({ isAuthenticated: false });
      console.log('Logged out successfully');
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
};

