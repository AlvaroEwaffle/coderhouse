const socket = io()

// Manejo de los mensajes recibidos del servidor
socket.on('products', product => {
  var productsList = document.getElementById('realTimeProducts');
  var listItem = document.createElement('li');
  listItem.innerHTML = `<strong>${product.title}</strong>: ${product.description} - $${product.price}`;
  productsList.appendChild(listItem);
});


// Evento de envío del formulario para agregar productos
document.getElementById('productForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const code = document.getElementById('code').value;
  const price = document.getElementById('price').value;
  const stock = document.getElementById('stock').value;

  fetch('/api/products/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title,
      description,
      code,
      price,
      stock
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Producto creado:', data);
  })
  .catch(error => {
    console.error('Error al agregar el producto:', error);
  });
});