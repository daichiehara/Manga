// BooksContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Book {
  id: string;
  title: string;
}

interface BooksContextType {
  books: Book[];
  addBook: (book: Book) => void;
  removeBook: (id: string) => void;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

// グローバルアクセス用の関数を保持する変数
let globalAddBook: (book: Book) => void;
let globalRemoveBook: (id: string) => void;

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error("useBooks must be used within a BooksProvider");
  }
  return context;
};

export const BooksProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);

  const addBook = (book: Book) => {
    setBooks(prevBooks => [...prevBooks, book]);
  };

  const removeBook = (id: string) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
  };

  // グローバル関数にローカル関数を割り当てる
  globalAddBook = addBook;
  globalRemoveBook = removeBook;

  return (
    <BooksContext.Provider value={{ books, addBook, removeBook }}>
      {children}
    </BooksContext.Provider>
  );
};

// コンポーネント外から呼び出せるグローバル関数
// 各関数を個別にエクスポートする
export const addGlobalBook = (book: Book) => {
    if (!globalAddBook) {
      console.warn("addBook was called before BooksProvider was mounted.");
      return;
    }
    globalAddBook(book);
  };
  
  export const removeGlobalBook = (id: string) => {
    if (!globalRemoveBook) {
      console.warn("removeBook was called before BooksProvider was mounted.");
      return;
    }
    globalRemoveBook(id);
  };

export default {BooksContext};
