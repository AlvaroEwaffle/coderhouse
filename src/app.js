const express = require('express');
const cors = require('cors'); // Import the cors middleware
const mongoose = require('mongoose');
const passport = require('passport');
const initializePassport = require('./utils/passport.config');
const dotenv = require('dotenv');
dotenv.config();

const productsRouter = require('./routes/ProductsRoutes');
const cartsRouter = require('./routes/CartsRoutes');
//const sessionRouter = require('./routes/sessions')
const authRoutes = require('./routes/AuthRoutes');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

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
app.use(cookieParser());
app.use(bodyParser.json());

app.use(session({
  secret: 'your_secret_key', // Replace 'your_secret_key' with a secret string for session encryption
  resave: false,
  saveUninitialized: false
}));

// Add Passport middleware
initializePassport();
app.use(passport.initialize());


// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
//OLD app.use('/api/sessions', sessionRouter);
app.use('/api/sessions', authRoutes);
//localhost:8080/api/sessions/githubcallback
//This will provide a refresh_token which can be used to request an updated access token when this access token expires.

//Connect to mongodb
const DB_URI = process.env.MONGO_DB
mongoose.connect(DB_URI, {
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