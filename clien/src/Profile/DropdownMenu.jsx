import React, { useState } from 'react';

const DropdownMenu = ({ user, setView, onLogout }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
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
            onClick={() => setView('profile')}
          >
            Profile
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={() => setView('dashboard')}
          >
            Dashboard
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
