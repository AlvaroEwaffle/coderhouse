import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:8080/api/sessions/current')
      .then(response => {
        if (response.data.role) {
          console.log("Create Product usertype:", response.data.role);
          setUsertype(response.data.role)
          if (response.data.role !== 'admin') {
            console.log('Not admin user, redirecting to product list page');
            navigate('/productlist');
          }
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized, redirecting to login");
          navigate('/login');
        } else {
          console.log("Error:", error);
        }
      })
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/products', {
        formData
      },{
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.status === 201) {
        toast.success('Product created successfully')

      } else {
        toast.error('Failed to create product')
      }
    } catch (error) {
      toast.error('Failed to create product')
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
