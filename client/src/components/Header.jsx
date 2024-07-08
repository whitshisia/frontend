import React from 'react';
import banner from '../assets/banner.webp';

function Header() {
  return (
    <div className='header'>
      <section className="flex flex-col justify-center items-center min-h-screen pt-16 bg-white relative">
        <img src={banner} alt="Library Management" className="h-[55vh] w-[100vw] object-cover" />
        <div className="absolute top-0 left-20 h-full flex flex-col justify-center items-start p-8">
          <div className="bg-opacity-70 p-4 rounded">
            <h1 className="text-4xl font-bold text-white mb-4">LIBRARY MANAGEMENT<br />SYSTEM</h1>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Header;
