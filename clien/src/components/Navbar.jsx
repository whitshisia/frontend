import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import logo from '../assets/logo.png';

const Navbar = () => {
  const [menu, setMenu] = useState('home');
  const navigate = useNavigate(); 

  const handleNavigation = (path) => {
    navigate(path);
  }

  return (
    <div className='navbar m-2'>
      <nav className="bg-blue-200 dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse text-white text-2xl">Majestic Folio Library
            {/* <img src={logo} className="h-8" alt="LIBRARY" /> */}
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button 
              type="button" 
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => handleNavigation('/signup')}
            >
              Sign Up
            </button>
            <button 
              type="button" 
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => handleNavigation('/login')}
            >
              Log In
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
