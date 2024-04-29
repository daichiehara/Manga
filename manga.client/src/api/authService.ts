import axios, { AxiosError } from 'axios';
import { updateGlobalAuthState } from '../components/context/AuthContext';
import { addGlobalBook, removeGlobalBook } from '../components/context/BookContext';

interface Book {
  id: number;  // オプショナルなプロパティとして定義
  itemId: number;
  title: string;
}

interface BooksApiResponse {
  ownedLists: Book[];
  sells: Book[];
}

type BookId = number;
type WishList = Book[]; // WishListはBookの配列です


const API_BASE_URL = 'https://localhost:7103/api';

export const bookService = {
  

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

