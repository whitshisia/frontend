import React, { useState } from 'react';

const DropdownMenu = ({ setView, onLogout }) => {
  const [open, setOpen] = useState(false);

  const handleProfileClick = () => {
    setView('/profile');
    setOpen(false); 
  };

  const handleDashboardClick = () => {
    setView('/dashboard');
    setOpen(false); 
  };

  const handleLogoutClick = () => {
    onLogout();
    setOpen(false); 
  };

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 m-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
            <button
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={handleProfileClick}
            >
              Profile
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={handleDashboardClick}
            >
              Dashboard
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={handleLogoutClick}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownMenu;
