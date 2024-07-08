import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBook } from '../services/api';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetchBook(id).then(data => setBook(data));
  }, [id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <p>{book.author}</p>
      <p>{book.genre}</p>
      <p>{book.isbn}</p>
      <p>{book.available_copies}</p>
    </div>
  );
};

export default BookDetail;
