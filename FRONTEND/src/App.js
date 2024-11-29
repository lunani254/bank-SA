import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './Registration';
import Login from './Login';
import Dashboard from './Dashboard';
import EmployeePortal from '../src/EmployeePortal';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee-portal" element={<EmployeePortal/>}/>
      </Routes>
    </Router>
  );
};

export default App;
