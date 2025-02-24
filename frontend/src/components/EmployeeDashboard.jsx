
import React, { useEffect, useState } from 'react';
import axios from 'axios';


const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { 'x-auth-token': token }
        });
        setUser(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };
    fetchUser();
  }, []);

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className=" bg-gray-300 p-6 text-black text-center rounded-t-lg">
          <div className="flex flex-col items-center">
           
            <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
            <p className="text-sm opacity-90">{user.email}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="border rounded-lg p-6 shadow-sm bg-white">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-gray-700">Gender:</p>
                <p className="text-gray-600">{user.gender}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Hobbies:</p>
                <p className="text-gray-600">{user.hobbies.join(', ')}</p>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-6 shadow-sm bg-white">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Department Information</h2>
            {user.department ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-700">Department Name:</p>
                  <p className="text-gray-600">{user.department.departmentName}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Category:</p>
                  <p className="text-gray-600">{user.department.categoryName}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Location:</p>
                  <p className="text-gray-600">{user.department.location}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Salary:</p>
                  <p className="text-gray-600">${user.department.salary}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Not assigned to any department yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;