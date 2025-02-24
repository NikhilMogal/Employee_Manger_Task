import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Signup from './components/Signup';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Signup />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;