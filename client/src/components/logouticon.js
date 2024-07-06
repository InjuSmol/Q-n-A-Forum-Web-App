import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CgLogOut } from "react-icons/cg";
import { Link } from 'react-router-dom';


const LogoutIcon = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      // send POST request to the server for logout
      await axios.post('http://localhost:8000/logout', { }, { withCredentials: true });
    // i think it shouldnt redirect to the welcome page before it is logged out succesfully
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (  
    <Link to='/'>
      <CgLogOut title="Log out" id="logouticon" className="logout-icon" onClick={handleLogout}/> 
    </Link>
  );
};

export default LogoutIcon;