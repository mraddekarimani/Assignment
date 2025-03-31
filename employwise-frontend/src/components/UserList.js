import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


function UserList({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      let fetchedUsers = response.data.data;
      let updatedUsers = JSON.parse(localStorage.getItem("updatedUsers")) || {};
      
      fetchedUsers = fetchedUsers.map(user => 
        updatedUsers[user.id] ? { ...user, ...updatedUsers[user.id] } : user
      );

      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (err) {
      setError("Failed to load users");
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setFilteredUsers(users.filter(user => 
      user.first_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      user.last_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      user.email.toLowerCase().includes(e.target.value.toLowerCase())
    ));
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
    setFilteredUsers([...filteredUsers].sort((a, b) => a[e.target.value].localeCompare(b[e.target.value])));
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setFilteredUsers(filteredUsers.filter(user => user.id !== id));
      setToastMessage("User deleted successfully!");
      setTimeout(() => setToastMessage(""), 2000);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between">
        <h2>User List</h2>
        <button className="btn btn-danger" onClick={onLogout}>Logout</button>
      </div>

      <div className="d-flex gap-3 my-3">
        <input type="text" className="form-control" placeholder="Search users..." value={search} onChange={handleSearch} />
        <select className="form-select" onChange={handleSort}>
          <option value="first_name">Sort by First Name</option>
          <option value="last_name">Sort by Last Name</option>
          <option value="email">Sort by Email</option>
        </select>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {toastMessage && <div className="alert alert-success">{toastMessage}</div>}

      {loading ? (
        <p className="text-center">Loading users...</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Avatar</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td><img src={user.avatar} alt="Avatar" className="rounded-circle" width="50" /></td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>
                  <button className="btn btn-warning mx-1" onClick={() => navigate(`/edit/${user.id}`)}>Edit</button>
                  <button className="btn btn-danger mx-1" onClick={() => deleteUser(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="d-flex justify-content-between">
        <button className="btn btn-primary" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
        <span>Page {page}</span>
        <button className="btn btn-primary" onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default UserList;
