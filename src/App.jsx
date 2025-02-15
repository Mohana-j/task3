import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

const App = () => {
  return (
    
      <Routes>
        <Route path="/task3/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/task2" element={<Task2 />} /> Ensure this exists */}
      </Routes>
   
  );
};

export default App;
