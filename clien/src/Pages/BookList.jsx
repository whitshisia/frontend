import React, { useContext, useState } from 'react';
import { BooksContext } from '../components/BooksContext';
import ReactPaginate from 'react-paginate';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
// import BookDetails from '../components/BookDetails';
import { faker } from '@faker-js/faker';
import Search from '../components/Search';

function BookList() {
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
      <Navbar />
      <Search />
      <h1 className="text-3xl font-bold text-center my-6">Library Book List</h1>
      <Toaster />
      {/* <BookDetails /> */}
      <div className="book-list grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 m-5 p-5">
        {currentBooks.map(book => (
          <div key={book.id} className="book-item flex flex-col bg-white rounded-lg shadow-lg">
            <img
              src={faker.image.url(150, 200, 'books', true)}
              alt={book.title}
              className="w-100 h-60 mb-4 rounded"
            />
            <div className="book-info text-center">
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-700">Author: {book.author}</p>
              <p className="text-gray-700">Number of books: {book.available_copies}</p>
              <p className={`text-${book.available_copies > 0 ? 'green' : 'red'}-500`}>
                Availability: {book.available_copies > 0 ? 'Available' : 'Unavailable'}
              </p>
              <button
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={book.count === 0}
                onClick={() => handleBorrow(book.id)}
              >
                Borrow
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination-container flex justify-center mt-6">
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
      <Footer />
    </div>
  );
}

export default BookList;
