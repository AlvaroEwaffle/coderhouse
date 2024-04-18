const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const cors = require('cors'); // Import the cors middleware


const app = express();
const port = process.env.PORT || 8080;
app.use(cors()); // Enable CORS


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// //Declare public folder
app.use(express.static(__dirname + '/public'));


// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

//Connect to mongodb
mongoose.connect('mongodb+srv://alvaro:8PWQQG372stpjA1w@ecommerce.jlrgk9q.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });

  // Create HTTP server
const httpServer = app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

//alvaro
//8PWQQG372stpjA1w