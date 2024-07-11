import React, { createContext, useState, useEffect } from 'react';

export const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [userProfile, setUserProfile] = useState({ borrowedBooks: [] });
  

  const server_url = "http://127.0.0.1:5000/books"

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

  const add_book = (title, author, genre, isbn, available_copies, auth_token) => {
    fetch(`${server_url}/create_book`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            author,
            genre,
            isbn,
            available_copies
        }),
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${auth_token}`
        },
    })
    .then((response) => response.json())
    .then((res) => {
        console.log(res);
        if (res.success) {
            toast.success(res.success);
            nav("/librarianprofile");
        } else if (res.error) {
            toast.error(res.error);
        } else {
            toast.error("An error occurred");
        }
    })
    .catch((error) => {
        console.error('Error adding book:', error);
        toast.error("An error occurred while adding book");
    });
};


  return (
    <BooksContext.Provider value={{ books, add_book, borrowBook, userProfile }}>
      {children}
    </BooksContext.Provider>
  );
};
