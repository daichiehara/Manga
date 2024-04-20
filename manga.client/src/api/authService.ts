import axios, { AxiosError } from 'axios';
import { updateGlobalAuthState } from '../components/context/AuthContext';
import { addGlobalBook, removeGlobalBook } from '../components/context/BookContext';

interface Book {
  id: string;  // オプショナルなプロパティとして定義
  itemId: string;
  title: string;
}

interface BooksApiResponse {
  ownedLists: Book[];
  sells: Book[];
}

type BookId = string; // `bookId`は文字列型ですが、意味の明確化のために型エイリアスを使用しています。
type WishList = Book[]; // WishListはBookの配列です


const API_BASE_URL = 'https://localhost:7103/api';

export const bookService = {
  getBooksData: async () => {
    try {
      const response = await axios.get<BooksApiResponse>(`${API_BASE_URL}/OwnedLists`, { withCredentials: true });
      console.log('Book data fetched:', response.data);
      const allBooks = [...response.data.ownedLists, ...response.data.sells]; // 2つのリストを結合
      allBooks.forEach(book => {
        addGlobalBook({ id: book.itemId, title: book.title }); // グローバルな書籍リストに追加
      });
      return response.data; // 処理されたデータを返す
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getWishLists: async () => {
    try {
      const response = await axios.get<WishList>(`${API_BASE_URL}/WishLists`, { withCredentials: true });
      console.log('Wish list data fetched:', response.data);
      response.data.forEach(book => addGlobalBook({ id: book.itemId, title: book.title }));
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  addOwnedLists: async (book: Book) => {
    try {
      const response = await axios.post<Book>(`${API_BASE_URL}/OwnedLists`, { title: book.title }, { withCredentials: true });
      console.log('Book added:', response.data);
      if (!response.data) {
        throw new Error('Invalid server response');
      }
      addGlobalBook(response.data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  
  addWishLists: async (book: Book) => {
    try {
      const response = await axios.post<Book>(`${API_BASE_URL}/WishLists`, { title: book.title }, { withCredentials: true });
      console.log('Book added:', response.data);
      if (!response.data) {
        throw new Error('Invalid server response');
      }
      addGlobalBook(response.data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  
  removeOwnedLists: async (sellId: BookId) => {
    try {
      await axios.delete(`${API_BASE_URL}/OwnedLists/${sellId}`, { withCredentials: true });
      console.log('Owned list book removed:', sellId);
      removeGlobalBook(sellId);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  
  removeWishLists: async (sellId: BookId) => {
    try {
      await axios.delete(`${API_BASE_URL}/WishLists/${sellId}`, { withCredentials: true });
      console.log('Wish list book removed:', sellId);
      removeGlobalBook(sellId);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
};

function handleError(error: unknown) {
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

