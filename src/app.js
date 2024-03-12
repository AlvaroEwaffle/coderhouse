const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const handlebars = require('express-handlebars');
const { Server } = require("socket.io");
const app = express();
const port = 8080;

const PRODUCTS_FILE_PATH = path.join(__dirname, 'data', 'productos.json');
const productlist = JSON.parse(fs.readFileSync(PRODUCTS_FILE_PATH, 'utf8'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));

// Crear la carpeta 'data' si no existe
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

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
