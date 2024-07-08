import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { borrowBook, returnBook, fetchBorrowingHistory } from '../services/api';

const BorrowingInterface = () => {
  const { authToken } = useContext(AuthContext);
  const [bookId, setBookId] = useState('');
  const [borrowingHistory, setBorrowingHistory] = useState([]);

  useEffect(() => {
    fetchBorrowingHistory(authToken).then(data => setBorrowingHistory(data));
  }, [authToken]);

  const handleBorrow = async () => {
    await borrowBook(authToken, bookId);
    fetchBorrowingHistory(authToken).then(data => setBorrowingHistory(data));
  };

  const handleReturn = async (borrowId) => {
    await returnBook(authToken, borrowId);
    fetchBorrowingHistory(authToken).then(data => setBorrowingHistory(data));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Book ID"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
      />
      <button onClick={handleBorrow}>Borrow</button>
      <h2>Borrowing History</h2>
      <ul>
        {borrowingHistory.map(borrow => (
          <li key={borrow.id}>
            {borrow.book.title} - Borrowed on {new Date(borrow.borrow_date).toLocaleDateString()}
            {!borrow.return_date && (
              <button onClick={() => handleReturn(borrow.id)}>Return</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BorrowingInterface;
