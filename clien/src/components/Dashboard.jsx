import React from 'react';

const Dashboard = ({ user }) => {
  if (!user || !user.borrowedBooks) {
    return <div>Loading...</div>; // or some other fallback UI
  }

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl mb-4">Dashboard</h2>
      {user.borrowedBooks.length === 0 ? (
        <p>No books borrowed yet.</p>
      ) : (
        <ul>
          {user.borrowedBooks.map((book, index) => (
            <li key={index} className="mb-2">
              {book}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
