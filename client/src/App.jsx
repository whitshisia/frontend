import React from 'react'
import Navbar from './components/Navbar/Navbar'
import { Routes } from 'react-router-dom'

const App = () => {
  return (
    <div className='app'>
      <Routes>
        <Navbar/>

        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      
    </div>
  )
}

export default App
