import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Search from '../components/Search'


const Home = () => {
  return (
    <div>
     <Navbar/>  
     <Search/>
     <Header/> 
     <Footer />
 </div>
  )
}

export default Home