import React, { useContext } from 'react';
import { UserContext } from '../components/UserContext';
import Dashboard from './Dashboard';
import DropdownMenu from './DropdownMenu';
import Navbar from './Navbar';
import Footer from './Footer';
const Profile = () => {
  const { login_user } = useContext(UserContext);

  if (!login_user) {
    return <div>Loading...</div>; // or some other fallback UI
  }

  return (
    <>
    <div className="bg-blue-300 p-6 rounded shadow-md">
      <Navbar />
      <h2 className="text-2xl mb-4">Profile</h2>
      <DropdownMenu user={login_user} />
      <div className="mb-4">
        <img
          src="https://randomuser.me/api/portraits/men/75.jpg"
          alt="User"
          className="w-24 h-24 rounded-full mx-auto"
        />
      </div>
      <div className="text-center">
        <p className="text-xl mb-2">{login_user.username}</p>
        <p className="text-gray-600">{login_user.email}</p>
      </div>
      <Dashboard />
      <Footer />
    </div>
    </>
  );
};

export default Profile;
