import React, { useState, useEffect } from 'react';
import validateSession from '../utils/validatesession.js'; // 
import { useNavigate } from 'react-router-dom';


const CreateProduct = () => {
  const [name, setName] = useState('');
  const [usertype, setUsertype] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    price: 0,
    stock: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    validateSession(setName, setUsertype, navigate);
    //If usertype is not admin, redirect to home
    if (usertype !== 'admin') {
      console.log('Not admin user, redirecting to product list page');
      navigate('/productlist');
    }
  }, []); // 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        console.log('Product created successfully');
        // Optionally, you can redirect the user to another page or perform any other action
      } else {
        console.error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div>
      <h1>Create Product</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
        </div>
        <div>
          <label htmlFor="code">Code:</label>
          <input type="text" id="code" name="code" value={formData.code} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="stock">Stock:</label>
          <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} />
        </div>
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;
