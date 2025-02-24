

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManagerDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({ departmentName: '', categoryName: '', location: '', salary: '', employeeIds: [] });
  const [editId, setEditId] = useState(null);
  const [queryResults, setQueryResults] = useState([]); 
  const [queryType, setQueryType] = useState(''); 

  useEffect(() => {
    fetchDepartments();
  }, [page]);

  const fetchDepartments = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`http://localhost:5000/api/department?page=${page}`, {
        headers: { 'x-auth-token': token }
      });
      setDepartments(res.data.departments);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onEmployeeIdsChange = (e) => setFormData({ ...formData, employeeIds: e.target.value.split(',') });

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/department/${editId}`, formData, {
          headers: { 'x-auth-token': token }
        });
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/api/department', formData, {
          headers: { 'x-auth-token': token }
        });
      }
      setFormData({ departmentName: '', categoryName: '', location: '', salary: '', employeeIds: [] });
      fetchDepartments();
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const onEdit = (dept) => {
    setEditId(dept._id);
    setFormData({
      departmentName: dept.departmentName,
      categoryName: dept.categoryName,
      location: dept.location,
      salary: dept.salary,
      employeeIds: dept.employees.map(e => e._id)
    });
  };

  const onDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/department/${id}`, {
        headers: { 'x-auth-token': token }
      });
      fetchDepartments();
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const fetchITQuery = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/department/query/it-a', {
        headers: { 'x-auth-token': token }
      });
      setQueryResults(res.data);
      setQueryType('IT Employees (Location starts with A)');
    } catch (err) {
      console.error(err.response.data);
      setQueryResults([]);
      setQueryType('Error fetching IT query');
    }
  };
  const fetchSalesQuery = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/department/query/sales-desc', {
        headers: { 'x-auth-token': token }
      });
      setQueryResults(res.data);
      setQueryType('Sales Employees (Sorted by Name Desc)');
    } catch (err) {
      console.error(err.response.data);
      setQueryResults([]);
      setQueryType('Error fetching Sales query');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Manager Dashboard</h1>

        <form onSubmit={onSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="departmentName" value={formData.departmentName} onChange={onChange} placeholder="Department Name" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="categoryName" value={formData.categoryName} onChange={onChange} placeholder="Category Name" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="location" value={formData.location} onChange={onChange} placeholder="Location" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="number" name="salary" value={formData.salary} onChange={onChange} placeholder="Salary" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <input type="text" name="employeeIds" value={formData.employeeIds.join(',')} onChange={onEmployeeIdsChange} placeholder="Employee IDs (comma separated)" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200">{editId ? 'Update' : 'Create'} Department</button>
        </form>

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departments.map(dept => (
                <tr key={dept._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.departmentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.categoryName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.salary}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{dept.employees.map(e => `${e.firstName} ${e.lastName}`).join(', ')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => onEdit(dept)} className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                    <button onClick={() => onDelete(dept._id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-center space-x-4 mb-8">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
          <span className="text-gray-700">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
        </div>

        {/* Query Buttons and Results */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Run Queries</h2>
          <div className="flex space-x-4 mb-6">
            <button
              onClick={fetchITQuery}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
            >
              IT Employees (Location A*)
            </button>
            <button
              onClick={fetchSalesQuery}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
            >
              Sales Employees (Name Desc)
            </button>
          </div>

          {queryType && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">{queryType}</h3>
              {queryResults.length > 0 ? (
                <ul className="space-y-2">
                  {queryResults.map((employee, index) => (
                    <li key={index} className="text-gray-700">
                      {employee.firstName} {employee.lastName}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No employees found for this query.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;