// LeftSidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const LeftSidebar = () => {
  const [usertype, setUsertype] = useState('');
  const navigate = useNavigate();

  //Useffect
  useEffect(() => {
    axios.get('http://localhost:8080/api/sessions/validate')
      .then(response => {
        if (response.data.valid) {
          setUsertype(response.data.userType)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }, []); // Fetch products when filters change

  const handleLogout = () => {
    // Aquí puedes hacer una solicitud al servidor para cerrar sesión
    // Por ejemplo, una solicitud para eliminar la sesión del usuario
    axios.get('http://localhost:8080/api/sessions/logout')
      .then(() => {
        navigate('/login');
      })
      .catch(error => {
        console.log(error);
      });
  };


  return (
    <div className="left-sidebar">
      <ul>
      {!usertype && (
        <li>
          <Link to="/login">Log In</Link>
        </li>)}
        {usertype === 'admin' && (
          <li>
            <Link to="/create-product">Create Product</Link>
          </li>
        )}
        {usertype &&
          (<li>
            <Link to="/productlist">Product List</Link>
          </li>) }
          {usertype &&           
          (<li>
            <Link to="/carts">Cart List</Link>
          </li>) }
          {usertype &&
          (<li>
            <button onClick={handleLogout}>Logout</button>
          </li>)}
      </ul>
    </div>
  );
};

export default LeftSidebar;
