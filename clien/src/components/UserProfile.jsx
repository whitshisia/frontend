import React, { useState, useContext } from 'react';
import DropdownMenu from './DropdownMenu';
import Login from '../Pages/LogIn';
import { UserContext } from '../components/UserContext';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
  };

  return (
    <UserContext.Provider value={{ login_user: user }}>
      <div className="min-h-screen bg-gray-100">
        {user ? (
          <div className="p-4">
            <DropdownMenu setView={setView} onLogout={handleLogout} />
            {view === 'profile' && <Profile />}
            {view === 'dashboard' && <Dashboard user={user} />}
          </div>
        ) : (
          <div className="p-4">
            <Login onLogin={handleLogin} />
          </div>
        )}
        
      </div>
    </UserContext.Provider>
  );
};

export default UserProfile;
