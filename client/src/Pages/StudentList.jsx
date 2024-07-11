import React, { useEffect, useState } from 'react';

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch('/http://127.0.0.1:5000/users')
      .then(response => response.json())
      .then(data => setStudents(data))
      .catch(error => console.error('Error fetching students:', error));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Students</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student, index) => (
          <div key={student.id} className="bg-white shadow-md rounded px-4 py-6">
            <img
              src={`https://picsum.photos/seed/${index}/200`}
              alt="Student"
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="text-xl font-semibold">{student.name}</h3>
            <p className="text-gray-700">Email: {student.email}</p>
            <p className="text-gray-700">ID: {student.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
