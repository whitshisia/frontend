import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import { BooksContext } from './BooksContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import BookList from '../Pages/BookList';
import toast from 'react-hot-toast';

const Profile = () => {
    const { currentUser, update_user, logout, auth_token } = useContext(UserContext);
    const { add_book } = useContext(BooksContext);

    const nav = useNavigate();
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [view, setView] = useState('viewProfile');
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        genre: '',
        isbn: '',
        available_copies: 0,
    });

    // Update form fields with current user details when currentUser changes
    useEffect(() => {
        if (currentUser) {
            setUsername(currentUser.username || '');
            setEmail(currentUser.email || '');
        }
    }, [currentUser]);

    // Handle unauthorized access or missing currentUser
    useEffect(() => {
        if (!currentUser) {
            nav("/login");
        }
    }, [currentUser, nav]);

    // Handle form input changes for adding a book
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission for adding a book
    const handleAddBook = (e) => {
        e.preventDefault();

        fetch('http://127.0.0.1:5000/create_book', {
            method: 'POST',
            body: JSON.stringify(newBook),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth_token}`
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((res) => {
            console.log(res);
            if (res.success) {
                toast.success(res.success);
                nav('/booklist');
            } else if (res.error) {
                toast.error(res.error);
            } else {
                toast.error('An error occurred');
            }
        })
        .catch((error) => {
            console.error('Error adding book:', error);
            toast.error('An error occurred while adding book');
        })
        .finally(() => {
            // Clear form fields after adding book
            setNewBook({
                title: '',
                author: '',
                genre: '',
                isbn: '',
                available_copies: 0,
            });
        });
    };

    // Handle form submission for updating profile
    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Ensure repeatPassword matches password
        if (password !== repeatPassword) {
            toast.error('Passwords do not match');
            return;
        }
    
        fetch('http://127.0.0.1:5000/update_user', {
            method: 'PUT',
            body: JSON.stringify({ username, email, password }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth_token}`
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((res) => {
            if (res.success) {
                update_user(res.updatedUser); // Assuming update_user updates the context
                toast.success(res.success);
                nav('/profile');
            } else if (res.error) {
                toast.error(res.error);
            } else {
                toast.error('An error occurred');
            }
        })
        .catch((error) => {
            console.error('Error updating profile:', error);
            toast.error('An error occurred while updating profile');
        });
    };
    
    // Ensure currentUser is loaded before rendering
    if (!currentUser) {
        return null; // or loading indicator or redirect to login
    }

    return (
        <>
            <div className=" p-6 rounded shadow-md">
                {/* Navigation buttons */}
                <nav className="bg-gray-800 p-4 rounded mb-6">
                    <ul className="flex space-x-4">
                        <li>
                            <button
                                className="text-white"
                                onClick={() => setView('updateProfile')}
                            >
                                Update Profile
                            </button>
                        </li>
                        <li>
                            {/* <button
                                className="text-white"
                                onClick={() => setView('viewProfile')}
                            >
                                View Profile
                            </button> */}
                        </li>
                        <li>
                            <button
                                className="text-white"
                                onClick={() => setView('booklist')}
                            >
                                Booklist
                            </button>
                        </li>
                        <li>
                            <button
                                className="text-white"
                                onClick={() => setView('dashboard')}
                            >
                                Dashboard
                            </button>
                        </li>
                        <li>
                            <button
                                className="text-white"
                                onClick={logout}
                            >
                                Log Out
                            </button>
                        </li>
                        {/* Add Books button conditionally based on isAdmin */}
                        {currentUser.is_admin && (
                            <li>
                                <button
                                    className="text-white"
                                    onClick={() => setView('addBook')}
                                >
                                    Add Books
                                </button>
                            </li>
                            // delete books

                        )}
                    </ul>
                </nav>

                {/* Conditional rendering based on `view` */}
                {view === 'updateProfile' && (
                    <div className="w-[50vw] border rounded-xl bg-gray-200 mx-auto p-6">
                        <h4 className="font-bold text-2xl text-center mt-8">Update Your Account</h4>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="name"
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="@gmail.com"
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Your password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Repeat password</label>
                                <input
                                    type="password"
                                    value={repeatPassword}
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Update
                            </button>
                        </form>
                    </div>
                )}

                {/* Display current user profile */}
                {view === 'viewProfile' && currentUser && (
                    <div className="text-center">
                        <div className="mb-4">
                            <img
                                src="https://randomuser.me/api/portraits/men/75.jpg"
                                alt="User"
                                className="w-24 h-24 rounded-full mx-auto"
                            />
                        </div>
                        <p className="text-xl mb-2">{currentUser.username}</p>
                        <p className="text-gray-600">{currentUser.email}</p>
                        <p className="bg-green-800 text-base font-normal text-white p-2 rounded-lg my-4">
                            {currentUser.is_admin ? 'Admin' : 'User'}
                        </p>
                        {/* <h4>
                        Your books:
                        {currentUser.books.map((book) => (
                            <div key={book.id} className="mb-4">
                                <h5>{book.title}</h5>
                                <p>{book.author}</p>
                            </div>
                        ))}
                        <button
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            onClick={handleDeleteBook}
                        >
                            Delete All Books
                        </button>
                    </h4> */}
                    </div>

                )}

                {/* Display Dashboard */}
                {view === 'dashboard' && <Dashboard user={currentUser} />}

                {/* Display Booklist */}
                {view === 'booklist' && (
                    <div>
                        <BookList />
                    </div>
                )}

                {/* Add Book form */}
                {view === 'addBook' && (
                    <div className="w-[50vw] border rounded-xl bg-gray-200 mx-auto p-6">
                        <h4 className="font-bold text-2xl text-center mt-8">Add a New Book</h4>
                        <form onSubmit={handleAddBook} className="p-6">
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={newBook.title}
                                    onChange={handleInputChange}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Enter title"
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Author</label>
                                <input
                                    type="text"
                                    name="author"
                                    value={newBook.author}
                                    onChange={handleInputChange}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Enter author"
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Genre</label>
                                <input
                                    type="text"
                                    name="genre"
                                    value={newBook.genre}
                                    onChange={handleInputChange}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Enter genre"
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">ISBN</label>
                                <input
                                    type="text"
                                    name="isbn"
                                    value={newBook.isbn}
                                    onChange={handleInputChange}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Enter ISBN"
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Available Copies</label>
                                <input
                                    type="number"
                                    name="available_copies"
                                    value={newBook.available_copies}
                                    onChange={handleInputChange}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Enter available copies"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Add Book
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile;
