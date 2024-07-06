import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [adminInfo, setAdminInfo] = useState({ memberSince: '', reputation: 0 });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Fetch admin information
    axios.get('http://localhost:8000/session-user', { withCredentials: true })
      .then(response => {
        const sessionUser = response.data;
        console.log(sessionUser);
        if (sessionUser.role === 'admin') {
          setAdminInfo({ memberSince: sessionUser.memberSince, reputation: sessionUser.reputation });
          setIsAdmin(true);
        }
      })
      .catch(error => console.error(error));

    // Fetch users
    axios.get('http://localhost:8000/users', { withCredentials: true })
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  function timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  const deleteUser = (userId) => {
    axios.delete(`http://localhost:8000/admin/users/${userId}`, { withCredentials: true })
      .then(() => setUsers(users.filter(user => user._id !== userId)))
      .catch(error => console.error(error));
  };

  const controlUser = (userData) => {
    axios.post('http://localhost:8000/admin-override', userData, { withCredentials: true });
  }

  if (isAdmin) {
    return (
      <div style={{ overflow: "scroll", width: '100%', margin:'10px' }}>
        <h1>Admin Dashboard</h1>
        <p>Member For: {timeSince(new Date(adminInfo.memberSince))}</p>
        <p>Reputation: {adminInfo.reputation}</p>
        <h2>All Users</h2>
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <Link to={`/questions`}>
                <span onClick={() => controlUser(user)}>{user.username}</span>
              </Link>
              <button onClick={() => deleteUser(user._id)} style={{padding: '10px', margin: '10px'}}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  else {
    return (
      <div>
        <h1>Permission Denied.</h1>
      </div>
    );
  }
}

export default AdminPage;