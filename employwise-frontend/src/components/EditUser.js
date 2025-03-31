import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ first_name: "", last_name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://reqres.in/api/users/${id}`);
      setUser({
        first_name: response.data.data.first_name,
        last_name: response.data.data.last_name,
        email: response.data.data.email
      });
    } catch (err) {
      setError("Failed to fetch user details. Please try again.");
    }
    setLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`https://reqres.in/api/users/${id}`, user);
      setSuccess("User updated successfully!");

      // Store updated user in localStorage
      let updatedUsers = JSON.parse(localStorage.getItem("updatedUsers")) || {};
      updatedUsers[id] = user;
      localStorage.setItem("updatedUsers", JSON.stringify(updatedUsers));

      setTimeout(() => {
        navigate("/users", { replace: true });
      }, 1000);
    } catch (err) {
      setError("Failed to update user. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Edit User</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="card p-4 shadow-lg mx-auto" style={{ maxWidth: "400px" }}>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={user.first_name} 
              onChange={(e) => setUser({ ...user, first_name: e.target.value })} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={user.last_name} 
              onChange={(e) => setUser({ ...user, last_name: e.target.value })} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control" 
              value={user.email} 
              onChange={(e) => setUser({ ...user, email: e.target.value })} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Update</button>
          <button type="button" className="btn btn-secondary w-100 mt-2" onClick={() => navigate("/users")}>Cancel</button>
        </form>
      )}
    </div>
  );
}

export default EditUser;
