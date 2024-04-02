const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const handlebars = require('express-handlebars');
const socketIo = require('socket.io');
const { Server } = require("socket.io");
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const Product = require('./dao/models/Products.Model.js');
let productlist = [];
async function loadProducts(){
try {
  data = await Product.find();
  const processedData = data.map(product => product.toObject());
  productlist = processedData;
  console.log(productlist);
} catch (error) {
  console.error('Error fetching products:', error);
}}

loadProducts()

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));


// Rutas
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Routes for Handlebars views
app.get('/', (req, res) => {
  res.render('home', { products: productlist });
});

app.get('/realtimeproducts', (_, res) => {
  res.render('realTimeProducts', { products: productlist });
});

// //Declare public folder
app.use(express.static(__dirname + '/public'));

// Create HTTP server
const httpServer = app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

// Create Socket.io server
const socketServer = new Server(httpServer);
app.set('socketio', socketServer);

socketServer.on('connection', (socket) => {
  console.log('Cliente conectado', socket.id);
  socket.on('disconnect', () => { console.log('Cliente desconectado', socket.id); });
});

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

//alvaro
//8PWQQG372stpjA1w