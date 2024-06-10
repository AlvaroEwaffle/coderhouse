import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LeftSidebar = () => {
  const [usertype, setUsertype] = useState('');
  const navigate = useNavigate();

  // Function to fetch user role
  const fetchUserRole = () => {
    axios.get('http://localhost:8080/api/sessions/current')
      .then(response => {
        if (response.data.role) {
          setUsertype(response.data.role);
        }
      })
      .catch(error => {
        console.error('Error fetching user role:', error);
        // Handle error as needed, such as redirecting to login page
        navigate('/login');
      });
  };

  useEffect(() => {
    // Fetch user role when the component mounts
    fetchUserRole();
  }, []); 

  const handleLogout = () => {
    axios.get('http://localhost:8080/api/sessions/logout')
      .then(() => {
        // Clear user role after logout
        setUsertype('');
        navigate('/login');
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  };

  return (
    <div className="left-sidebar">
      <ul>
        {!usertype && (
          <li>
            <Link to="/login">Log In</Link>
          </li>
        )}
        {usertype === 'admin' && (
          <li>
            <Link to="/create-product">Create Product</Link>
          </li>
        )}
        {usertype && (
          <li>
            <Link to="/productlist">Product List</Link>
          </li>
        )}
        {/* {usertype && (
          <li>
            <Link to="/carts">Cart List</Link>
          </li>
        )} */}
        {usertype && (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default LeftSidebar;
