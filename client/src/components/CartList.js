import React, { useState, useEffect } from 'react';

const CartList = () => {
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/carts`);
      const data = await response.json();
      setCarts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCreateCart = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/carts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // You can include any payload if required
      });
      if (response.ok) {
        // If the request was successful, fetch carts again to update the list
        fetchCarts();
      } else {
        console.error('Failed to create cart:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating cart:', error);
    }
  };

  const handleDeleteCart = async (cartId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/carts/${cartId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // If the deletion is successful, update the cart list
        fetchCarts();
      } else {
        console.error('Failed to delete cart:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting cart:', error);
    }
  };

  return (
    <div>
      <h1>Cart List</h1>
      <button onClick={handleCreateCart}>Create New Cart</button>
      <ul>
        {carts.map(cart => (
          <li key={cart._id}>
            <h3>Cart ID: {cart._id}</h3>
            <ul>
              {cart.products.length > 0 ? (
                cart.products.map(product => (
                  <li key={product._id}>
                    Product ID: {product._id}, Title: {product.title}, Quantity: {product.quantity}
                  </li>
                ))
              ) : (
                <li>No products in this cart</li>
              )}
              <button onClick={() => handleDeleteCart(cart._id)}>Delete</button>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartList;
