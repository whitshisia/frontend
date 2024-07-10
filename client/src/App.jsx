import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import LogIn from './Pages/LogIn'
import Signup from "./Pages/Signup"
const App = () => {
  return (
    <div className='text-blue-500'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/signup' element={<Signup />} />
        
      </Routes>
      
    </div>
  )
}

export default App
