import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchProfile, fetchBorrowingHistory } from '../services/api';

const UserProfile = () => {
  const { authToken } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [borrowingHistory, setBorrowingHistory] = useState([]);

  useEffect(() => {
    fetchProfile(authToken).then(data => setProfile(data));
    fetchBorrowingHistory(authToken).then(data => setBorrowingHistory(data));
  }, [authToken]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{profile.username}'s Profile</h1>
      <p>{profile.email}</p>
      <p>{profile.contact_info}</p>
      <img src={profile.profile_image} alt="Profile" />
      <h2>Borrowing History</h2>
      <ul>
        {borrowingHistory.map(borrow => (
          <li key={borrow.id}>
            {borrow.book.title} - Borrowed on {new Date(borrow.borrow_date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
