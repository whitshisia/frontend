import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchBooks, createBook, updateBook, deleteBook } from '../services/api';

const AdminDashboard = () => {
  const { authToken } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    available_copies: 0,
  });

  useEffect(() => {
    fetchBooks().then(data => setBooks(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBook(authToken, bookForm);
    fetchBooks().then(data => setBooks(data));
    setBookForm({
      title: '',
      author: '',
      genre: '',
      isbn: '',
      available_copies: 0,
    });
  };

  const handleUpdate = async (id) => {
    await updateBook(authToken, id, bookForm);
    fetchBooks().then(data => setBooks(data));
  };

  const handleDelete = async (id) => {
    await deleteBook(authToken, id);
    fetchBooks().then(data => setBooks(data));
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={bookForm.title}
          onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={bookForm.author}
          onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
        />
        <input
          type="text"
          placeholder="Genre"
          value={bookForm.genre}
          onChange={(e) => setBookForm({ ...bookForm, genre: e.target.value })}
        />
        <input
          type="text"
          placeholder="ISBN"
          value={bookForm.isbn}
          onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
        />
        <input
          type="number"
          placeholder="Available Copies"
          value={bookForm.available_copies}
          onChange={(e) => setBookForm({ ...bookForm, available_copies: e.target.value })}
        />
        <button type="submit">Add Book</button>
      </form>
      <ul>
        {books.map(book => (
          <li key={book.id}>
            {book.title} - {book.author}
            <button onClick={() => handleUpdate(book.id)}>Update</button>
            <button onClick={() => handleDelete(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
