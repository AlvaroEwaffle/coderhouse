// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LeftSidebar from './components/LeftSidebar';
import ProductList from './components/ProductList';
import CreateProduct from './components/CreateProduct';
import CartList from './components/CartList';
import Login from './components/Login'; // Import the Login component
import Register from './components/Register'; // Import the Register component
import './styles.css'; // Import the styles.css file
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <Router>
      <div className="app-container">
        <ToastContainer />
        <LeftSidebar />
        <Routes>
          <Route path="/login" element={<Login />} /> {/* Route for the Login component */}
          <Route path="/register" element={<Register />} /> {/* Route for the Register component */}
          <Route path="/productlist" element={<ProductList />} />
          <Route path="/carts" element={<CartList />} />
          <Route path="/create-product" element={<CreateProduct />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
