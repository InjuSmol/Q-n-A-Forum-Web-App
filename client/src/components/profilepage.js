import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserPage = () => {
  const [userInfo, setUserInfo] = useState({ memberSince: '', reputation: 0 });

  useEffect(() => {
    // Fetch admin information
    axios.get('http://localhost:8000/session-user', { withCredentials: true })
      .then(response => {
        const sessionUser = response.data;
        console.log(sessionUser);
        setUserInfo({ memberSince: sessionUser.memberSince, reputation: sessionUser.reputation });
      })
      .catch(error => console.error(error));
    }
  );

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
    return (
        <div style={{ overflow: "scroll", width: '100%', margin:'10px' }}>
        <h1>User Dashboard</h1>
        <p>Member For: {timeSince(new Date(userInfo.memberSince))}</p>
        <p>Reputation: {userInfo.reputation}</p>
        </div>
    );
};

export default UserPage;