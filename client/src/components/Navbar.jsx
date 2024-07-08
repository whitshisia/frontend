import React, { useState } from 'react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [menu, setMenu] = useState('home');

  return (
    <div className='navbar m-2'>
      {/* <img src={logo} alt="Logo" className='logo' /> */}
      {/* <ul className='nav-links'>
        <li className={menu === "home" ? "active" : ""} onClick={() => setMenu('home')}>Home</li>
        <li className={menu === "login" ? "active" : ""} onClick={() => setMenu('login')}>Login</li>
        <li className={menu === "register" ? "active" : ""} onClick={() => setMenu('register')}>Register</li>
      </ul> */}

      <nav className="bg-blue-200 dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/home" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className="h-8" alt=" Logo" />
          {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">E-Learning</span> */}
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign In</button>
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Log In</button>
        </div>
      </div>
    </nav>

    </div>
    
  );
}

export default Navbar;
