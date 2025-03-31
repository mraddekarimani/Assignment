import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import UserList from "./components/UserList";
import EditUser from "./components/EditUser";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={token ? <Navigate to="/users" /> : <Login onLogin={handleLogin} />} />
        
        {/* User List - Protected */}
        <Route path="/users" element={token ? <UserList onLogout={handleLogout} /> : <Navigate to="/" />} />
        
        {/* Edit User - Protected */}
        <Route path="/edit/:id" element={token ? <EditUser /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
