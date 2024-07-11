import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditBookForm from './EditBookForm'; 
import { editBook } from './Api'; 

const BookEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/book/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch book');
        }
        return response.json();
      })
      .then(data => setBook(data))
      .catch(error => console.error('Error fetching book:', error));
  }, [id]);

  const handleSave = async (editedBook) => {
    try {
      await editBook(id, editedBook);
      navigate('/booklist'); 
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleClose = () => {
    navigate('/booklist'); 
  };

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Edit Book</h2>
      <EditBookForm book={book} onSave={handleSave} onClose={handleClose} />
    </div>
  );
};

export default BookEditPage;
