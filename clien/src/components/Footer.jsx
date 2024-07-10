import React from 'react'

function Footer() {
  return (
    <div>
      <footer className="fixed bottom-0 left-0 z-20 w-full p-4 bg-green-500 text-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
        <div className="max-w-screen-xl w-full mx-auto text-center md:text-left">
          &copy; 2024 E-Library. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Footer
