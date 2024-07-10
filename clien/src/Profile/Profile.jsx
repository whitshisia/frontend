import React from 'react';

const Profile = ({ user }) => {
  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl mb-4">Profile</h2>
      <div className="mb-4">
        <img
          src="https://randomuser.me/api/portraits/men/75.jpg"
          alt="User"
          className="w-24 h-24 rounded-full mx-auto"
        />
      </div>
      <div className="text-center">
        <p className="text-xl mb-2">{user.username}</p>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  );
};

export default Profile;
