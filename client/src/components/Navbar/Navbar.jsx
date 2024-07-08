import React, { useState } from 'react';
import './navbar.css';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [menu, setMenu] = useState('home');

  return (
    <div className='navbar m-2'>
      <img src={logo} alt="Logo" className='logo' />
      <ul className='nav-links'>
        <li className={menu === "home" ? "active" : ""} onClick={() => setMenu('home')}>Home</li>
        <li className={menu === "login" ? "active" : ""} onClick={() => setMenu('login')}>Login</li>
        <li className={menu === "register" ? "active" : ""} onClick={() => setMenu('register')}>Register</li>
      </ul>
    </div>
  );
}

export default Navbar;
