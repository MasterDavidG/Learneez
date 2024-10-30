import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/users').then(response => setUsers(response.data));
  }, []);

  return (
    <div>
      <h1>Hello, Admin</h1>
      <p>Manage users below:</p>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.role}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
