// BooksContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Book {
  itemId: number;  
  title: string;
}

interface BooksContextType {
  books: Book[];
  addBook: (book: Book) => void;
  removeBook: (itemId: number) => void;  
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

// グローバルアクセス用の関数を保持する変数
let globalAddBook: (book: Book) => void;
let globalRemoveBook: (id: number) => void;

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

const removeBook = (itemId: number) => {
      setBooks(prevBooks => prevBooks.filter(book => book.itemId !== itemId));  // `id` を `itemId` に変更
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

export const removeGlobalBook = (itemId: number) => {
  if (!globalRemoveBook) {
      console.warn("removeBook was called before BooksProvider was mounted.");
      return;
  }
  globalRemoveBook(itemId);  // `id` を `itemId` に変更
};


export default {BooksContext};
