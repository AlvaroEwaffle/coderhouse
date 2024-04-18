// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LeftSidebar from './components/LeftSidebar';
import ProductList from './components/ProductList';
import CreateProduct from './components/CreateProduct';
import CartList from './components/CartList';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <LeftSidebar />
        <Routes>
          <Route path="/productlist" element={<ProductList />} />
          <Route path="/carts" element={<CartList />} />
          <Route path="/create-product" element={<CreateProduct />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
