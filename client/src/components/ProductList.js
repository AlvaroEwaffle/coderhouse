import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';


const ProductList = () => {
  const [name, setName] = useState('');
  const [usertype, setUsertype] = useState('');
  const [products, setProducts] = useState([]);
  const [userCart, setUserCart] = useState('');
  const [selectedCart, setSelectedCart] = useState('');
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:8080/api/sessions/current')
      .then(response => {
        console.log("Validate Session Response Data:", response.data);
        if (response.data.role) {
          setName(response.data.email);
          setUsertype(response.data.role);
          setUserCart(response.data.cart);
          fetchProducts();
        } else {
          console.log("Usuario sin rol?");
          navigate('/login');
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized, redirecting to login");
          navigate('/login');
        } else {
          console.log("Error:", error);
        }
      });
  }, [filters]); // Fetch products when filters change

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`http://localhost:8080/api/products?${queryParams}`);
      const data = await response.json();
      setProducts(data.payload);
      setPagination({
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevLink: data.prevLink,
        nextLink: data.nextLink
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/carts/${selectedCart}/product/${productId}`, {
        method: 'POST',
      });
      if (response.ok) {
        // If the product is successfully added to the cart, toast message
        toast.success(`Product ${productId} added to cart ${selectedCart}`)
      } else {
        console.error('Failed to add product to cart:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newFilters = {};
    formData.forEach((value, key) => {
      newFilters[key] = value;
    });
    setFilters(newFilters);
  };

  const goToNextPage = () => {
    if (pagination.hasNextPage) {
      fetch(pagination.nextLink)
        .then(response => response.json())
        .then(data => {
          setProducts(data.payload);
          setPagination({
            totalPages: data.totalPages,
            prevPage: data.prevPage,
            nextPage: data.nextPage,
            page: data.page,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevLink: data.prevLink,
            nextLink: data.nextLink
          });
        })
        .catch(error => {
          console.error('Error fetching next page:', error);
        });
    }
  };

  const goToPrevPage = () => {
    if (pagination.hasPrevPage) {
      fetch(pagination.prevLink)
        .then(response => response.json())
        .then(data => {
          setProducts(data.payload);
          setPagination({
            totalPages: data.totalPages,
            prevPage: data.prevPage,
            nextPage: data.nextPage,
            page: data.page,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevLink: data.prevLink,
            nextLink: data.nextLink
          });
        })
        .catch(error => {
          console.error('Error fetching previous page:', error);
        });
    }
  };

  return (
    <div>
      <h1>Products Page: {name}  Rol: {usertype} Cart: {userCart}</h1>
      {/* Filter Form */}
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" />
        <input type="number" name="price" placeholder="Price" />
        <input type="text" name="code" placeholder="Code" />
        <button type="submit">Apply Filters</button>
      </form>

      {/* Product List */}
      <div>
        {products.map(product => (
          <div key={product._id}>
            <h2>{product.title}</h2>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price}</p>
            {/* Add more product information here as needed */}
            <button onClick={() => handleAddToCart(product._id)}>Add to Cart</button>

            <select onChange={(e) => setSelectedCart(e.target.value)}>
              <option value="">Select Cart</option>
              <option key={userCart} value={userCart}>{`Cart ${userCart}`}</option>
            </select>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div>
        {pagination.hasPrevPage && (
          <button onClick={goToPrevPage}>Prev Page</button>
        )}
        {pagination.hasNextPage && (
          <button onClick={goToNextPage}>Next Page</button>
        )}
      </div>
    </div>
  );
};

export default ProductList;
