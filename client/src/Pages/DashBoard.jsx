import React, { useContext, useState } from 'react';
import { BooksContext } from '../context/BooksContext';
import ReactPaginate from 'react-paginate';
import toast, { Toaster } from 'react-hot-toast';

function DashBoard() {
  const { books, borrowBook } = useContext(BooksContext);
  const [currentPage, setCurrentPage] = useState(0);
  const booksPerPage = 10;

  const handleBorrow = (bookId) => {
    borrowBook(bookId);
    toast.success('Book borrowed successfully');
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * booksPerPage;
  const currentBooks = books.slice(offset, offset + booksPerPage);

  return (
    <div>
      <h1>Library Dashboard</h1>
      <Toaster />
      <div className="book-list">
        {currentBooks.map(book => (
          <div key={book.id} className="book-item">
            <h2>{book.title}</h2>
            <p>Author: {book.author}</p>
            <p>Number of books: {book.count}</p>
            <p>Availability: {book.count > 0 ? 'Available' : 'Unavailable'}</p>
            <button 
              disabled={book.count === 0} 
              onClick={() => handleBorrow(book.id)}
            >
              Borrow
            </button>
          </div>
        ))}
      </div>
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(books.length / booksPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
}

export default DashBoard;
