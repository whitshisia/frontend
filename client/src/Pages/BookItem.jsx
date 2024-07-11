import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookItem = ({ book, onDelete }) => {
  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:5000/delete_books/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete book');
        }
        onDelete(id); // Update state or UI after successful deletion
        toast.success('Book deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting book:', error);
        toast.error('Failed to delete book');
      });
  };

  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-medium mb-2">{book.title}</h3>
      <p className="text-gray-700 mb-2">Author: {book.author}</p>
      <p className="text-sm text-gray-500 mb-4">Category: {book.category}</p>
      {/* Placeholder for a random image */}
      <div className="h-32 bg-gray-200 rounded-md mb-2"></div>
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
          onClick={() => handleDelete(book.id)}
        >
          Delete
        </button>
        {/* Add an edit button or other actions as needed */}
      </div>
    </div>
  );
};

export default BookItem;
