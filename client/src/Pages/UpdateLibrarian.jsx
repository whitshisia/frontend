import React, { useState, useEffect } from 'react';

const UpdateLibrarian = () => {
  const [librarian, setLibrarian] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    fetch('/http://127.0.0.1:5000/users')
      .then(response => response.json())
      .then(data => setLibrarian(data))
      .catch(error => console.error('Error fetching librarian details:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLibrarian({ ...librarian, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/http://127.0.0.1:5000/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(librarian)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Librarian updated:', data);
        // Optionally, you can show a success message or redirect
      })
      .catch(error => console.error('Error updating librarian details:', error));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Update Librarian</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={librarian.name}
            onChange={handleChange}
            placeholder="Enter librarian name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={librarian.email}
            onChange={handleChange}
            placeholder="Enter librarian email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Librarian
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateLibrarian;
