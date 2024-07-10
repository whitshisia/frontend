import React, { createContext, useState, useEffect } from 'react';

export const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [userProfile, setUserProfile] = useState({ borrowedBooks: [] });
  
  useEffect(() => {
    fetch('http://127.0.0.1:5000/books', {
      mode: 'cors',
            headers: {
                'Content-Type': 'application/json',}
    }) 
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error(error));
  }, []);

  const borrowBook = (bookId) => {
    setBooks(prevBooks => prevBooks.map(book => {
      if (book.id === bookId && book.count > 0) {
        return { ...book, count: book.count - 1 };
      }
      return book;
    }));
    setUserProfile(prevProfile => ({
      ...prevProfile,
      borrowedBooks: [...prevProfile.borrowedBooks, bookId]
    }));
  };

  return (
    <BooksContext.Provider value={{ books, borrowBook, userProfile }}>
      {children}
    </BooksContext.Provider>
  );
};
