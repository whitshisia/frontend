import React, { useContext, useState } from 'react';
import { BooksContext } from '../components/BooksContext';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
// import Dashboard from '../components/Dashboard';
import { faker } from '@faker-js/faker';
import { UserContext } from '../components/UserContext';
import { Link } from 'react-router-dom';
function BookList() {
  const { books, borrowBook } = useContext(BooksContext);
  const { currentUser } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('title');
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  const handleBorrow = (bookId) => {
    fetch ('http://127.0.0.1:5000/book/borrow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ book_id: bookId }),
    })
      .then(() => {
        const borrowedBook = books.find((book) => book.id === bookId);
        setBorrowedBooks((prevBorrowedBooks) => [...prevBorrowedBooks, borrowedBook]);
        toast.success('Book borrowed successfully');
      })
      .catch((error) => {
        toast.error(`Failed to borrow book: ${error.message}`);
      });
  };

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:5000/delete_book/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete book');
        }
        onDelete(id); 
        toast.success('Book deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting book:', error);
        toast.error('Failed to delete book');
      });
  };


  const addToDashboard = (book) => {
    setBorrowedBooks((prevBorrowedBooks) => [...prevBorrowedBooks, book]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const filteredBooks = books.filter((book) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (filter === 'title') {
      return book.title.toLowerCase().includes(lowerCaseQuery);
    } else if (filter === 'author') {
      return book.author.toLowerCase().includes(lowerCaseQuery);
    } else if (filter === 'genre') {
      return book.genre.toLowerCase().includes(lowerCaseQuery);
    }
    return true;
  });

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center my-6">Library Book List</h1>
        <Toaster />
        <form onSubmit={handleSearch} className="flex justify-center mb-6">
          <div className="flex flex-col md:flex-row">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-l-lg py-2 px-4 bg-white focus:outline-none"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="genre">genre</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search by ${filter}`}
              className="border border-gray-300 py-2 px-4 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-r-lg py-2 px-4 hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </form>
        <div className="book-list grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 m-5 p-5">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-item flex flex-col bg-white rounded-lg shadow-lg">
              <img
                src={faker.image.url(150, 200, 'books', true)}
                alt={book.title}
                className="w-100 h-60 mb-4 rounded"
              />
              <div className="book-info text-center">
                <h2 className="text-xl font-semibold">{book.title}</h2>
                <p className="text-gray-700">Author: {book.author}</p>
                <p className="text-gray-700">genre: {book.genre}</p>
                <p className="text-gray-700">Number of books: {book.available_copies}</p>
                <p className={`text-${book.available_copies > 0 ? 'green' : 'red'}-500`}>
                  Availability: {book.available_copies > 0 ? 'Available' : 'Unavailable'}
                </p>

                {/* Conditional rendering for buttons based on admin status */}
                {currentUser.is_admin ? (
                  <div className="mt-4 space-x-2">
                    <Link to={`/edit/${book.id}`} data-modal-target="authentication-modal" data-modal-toggle="authentication-modal" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Edit
                    </Link>

                    <div id="authentication-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">

        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">

            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Sign in to our platform
                </h3>
                <button type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>

            <div class="p-4 md:p-5">
                <form class="space-y-4" action="#">
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <div class="flex justify-between">
                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                            </div>
                            <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                        </div>
                        <a href="#" class="text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>
                    </div>
                    <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                        Not registered? <a href="#" class="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div> 

                    <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(book.id)}>
                      Delete
                    </button>
                  </div>
                ) : (
                  <button
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    disabled={book.available_copies === 0}
                    onClick={() => handleBorrow(book.id)}
                  >
                    Borrow
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>
        {/* <Dashboard borrowedBooks={borrowedBooks} addToDashboard={addToDashboard} /> */}
      </div>
      <Footer />
    </div>
  );
}

export default BookList;
