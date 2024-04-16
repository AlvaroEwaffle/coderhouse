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
const Message = require('./dao/models/messages.Model.js');

let productlist = [];
//Load Product List
async function loadProducts(){
try {
  data = await Product.find();
  const processedData = data.map(product => product.toObject());
  productlist = processedData;
 // console.log(productlist);
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

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products: productlist });
});

// Ruta para mostrar todos los productos con paginación
app.get('/products', (req, res) => {
  res.render('products', { products: productlist });
});

// Ruta para mostrar un carrito específico
app.get('/carts/:cid', (req, res) => {
  res.render('getCartByIdView', {cart: cart});
});

//Load Chat List
let messagelist = [];
async function loadmessagelist(){
  try {
    data = await Message.find().sort({ timestamp: -1 });
    const processedData = data.map(message => message.toObject());
    messagelist = processedData;
   // console.log(productlist);
  } catch (error) {
    console.error('Error fetching products:', error);
  }}
  loadmessagelist()

app.get('/chat', (req, res) => {
  res.render('chat', { messages: messagelist });
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
  //Proceso y guarda mensajes
  socket.on('chatMessage', (message) => {
    socketServer.emit('newMessage', message);    
    console.log(message);
    Message.create({
      user: message.user,
      text: message.text
    })
    loadProducts();
  })
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