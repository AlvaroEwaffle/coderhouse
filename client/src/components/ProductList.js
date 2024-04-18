import React, { useState, useEffect } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [carts, setCarts] = useState([]);
  const [selectedCart, setSelectedCart] = useState('');
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchCarts();
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

  const fetchCarts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/carts');
      const data = await response.json();
      setCarts(data);
    } catch (error) {
      console.error('Error fetching carts:', error);
    }
  };

  const handleAddToCart = async (productId) => {
  
    try {
      const response = await fetch(`http://localhost:8080/api/carts/${selectedCart}/product/${productId}`, {
        method: 'POST',
      });
      if (response.ok) {
        // If the product is successfully added to the cart, update the cart list
        fetchCarts();
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
      <h1>Products Page</h1>
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
              {carts.map((cart) => (
                <option key={cart._id} value={cart._id}>{`Cart ${cart._id}`}</option>
              ))}
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
