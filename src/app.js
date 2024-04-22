const express = require('express');
const cors = require('cors'); // Import the cors middleware

const mongoose = require('mongoose');

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const sessionRouter = require('./routes/sessions')
const sessionMiddleware = require('./session/mongoStorage')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true

}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(cookieParser());
app.use(bodyParser.json());

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionRouter);

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