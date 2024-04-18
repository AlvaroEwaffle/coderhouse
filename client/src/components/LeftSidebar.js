// LeftSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const LeftSidebar = () => {
  return (
    <div className="left-sidebar">
      <ul>
        <li>
          <Link to="/productlist">Product List</Link>
        </li>
        <li>
          <Link to="/carts">Cart List</Link>
        </li>
        <li>
          <Link to="/create-product">Create Product</Link>
        </li>
      </ul>
    </div>
  );
};

export default LeftSidebar;
