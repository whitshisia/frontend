import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LibrarianProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/users')
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user details:', error));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Librarian Profile</h2>
        <div className="bg-white shadow-md rounded px-8 py-6 mb-4">
          {user ? (
            <>
              <img
                src={`https://picsum.photos/seed/${user.id}/200`}
                alt="Librarian"
                className="w-24 h-24 rounded-full mx-auto"
                />
              <p className="text-lg mb-2"><span className="font-semibold">Name:</span> {user.name}</p>
              <p className="text-lg mb-2"><span className="font-semibold">Email:</span> {user.email}</p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto px-4">
        <ul className="flex justify-center">
          <li className="mr-6">
            <Link to="/librarianprofile" className="text-white hover:text-gray-200">
              Librarian Profile
            </Link>
          </li>
          <li className="mr-6">
            <Link to="/updatelibrarian" className="text-white hover:text-gray-200">
              Update Librarian
            </Link>
          </li>
          <li className="mr-6">
            <Link to="/studentlist" className="text-white hover:text-gray-200">
              Students
            </Link>
          </li>
          <li className="mr-6">
            <Link to="/createbook" className="text-white hover:text-gray-200">
              Create Book
            </Link>
          </li>
          <li>
            <Link to="/booklist" className="text-white hover:text-gray-200">
              Books
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default LibrarianProfile;
