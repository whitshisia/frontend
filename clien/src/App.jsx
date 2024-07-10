import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import LogIn from './Pages/LogIn'
import Signup from "./Pages/Signup"
import { BooksProvider } from './components/BooksContext'
import { UserProvider } from './components/UserContext';
import Profile from "../src/components/Profile"
import UserProfile from '../src/components/UserProfile'
import BookList from './Pages/BookList'
import Dashboard from './components/Dashboard'
import DropdownMenu from './components/DropdownMenu'
const App = () => {
  return (
    <div className='text-blue-500'>
      <BooksProvider>
       <UserProvider> 
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/booklist' element={<BookList />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='dashboard' element={<Dashboard/>} />
        <Route path='/dropdownmenu' element={<DropdownMenu/>} />
        <Route path='userprofile' element={<UserProfile/>} />
      </Routes>
      </UserProvider>
      </BooksProvider>
    </div>
  )
}

export default App
