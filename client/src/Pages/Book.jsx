import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { BooksContext } from '../context/BooksContext';

function BookDetails() {
  const { books } = useContext(BooksContext);
  const { bookId } = useParams();
  const book = books.find(b => b.id === parseInt(bookId));

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <p>Author: {book.author}</p>
      <p>Number of books: {book.count}</p>
      <p>Availability: {book.count > 0 ? 'Available' : 'Unavailable'}</p>
      <p>Description: {book.description}</p>
    </div>
  );
}

export default BookDetails;
