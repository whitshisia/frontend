import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/bookborrows')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch borrowed books');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.borrowedBooks) {
          setBorrowedBooks(data.borrowedBooks);
        } else {
          setBorrowedBooks([]);
        }
      })
      .catch(error => {
        console.error('Error fetching borrowed books:', error);
        setBorrowedBooks([]); 
      });
  }, []);

  const handleReturnBook = (bookId) => {
    fetch(`http://127.0.0.1:5000/bookborrows/${bookId}/return`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to return book');
        }
        // Update local state to reflect book returned
        setBorrowedBooks(prevBooks => prevBooks.map(book =>
          book.id === bookId ? { ...book, returnedOn: new Date().toISOString().split('T')[0] } : book
        ));
        toast.success('Book returned successfully');
      })
      .catch(error => {
        console.error('Error returning book:', error);
        toast.error('Failed to return book');
      });
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <ToastContainer />
      <h2 className="text-2xl mb-4">Borrowed Books</h2>
      {borrowedBooks && borrowedBooks.length === 0 ? (
        <p>No books borrowed yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {borrowedBooks.map((book, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-2">{book.title}</h3>
              <p className="text-gray-700 mb-2">Author: {book.author}</p>
              <p className="text-sm text-gray-500 mb-4">Borrowed On: {book.borrowedOn}</p>
              {/* Placeholder for a random image */}
              <div className="h-32 bg-gray-200 rounded-md mb-2"></div>
              <button
                onClick={() => handleReturnBook(book.id)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Return Book
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
