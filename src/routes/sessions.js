const { Router } = require('express')
const User = require('../dao/models/User.Model')
const Cart = require('../dao/models/Carts.Model')
const router = Router()
const jwt = require('jsonwebtoken');
const { hashPassword, isValidPassword } = require('../utils/bcrypt.js')
const passport = require("passport");
const { generateToken } = require('../utils/jwt')

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verify if the user exists in the database
        const user = await User.findOne({ email });

        // If the user doesn't exist, return a 401 Unauthorized response
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Verify if the password is correct
        if (!isValidPassword(user, password)) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const credentials = { id: user._id.toString(), email: user.email, role: user.role, cart: user.cart };
        const accessToken = generateToken(credentials)
        res.cookie('accessToken', accessToken, { maxAge: 60 * 1000, httpOnly: true })

        // Send a success response
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        // If an error occurs, return a 500 Internal Server Error response
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, age, password } = req.body;

    try {
        // Check if the user already exists in the database
        const existingUser = await User.findOne({ email });

        // If the user already exists, return a 409 Conflict response
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Create a cart for the user
        const newCart = await Cart.create({ /* cart properties */ });

        // Create a new user in the database
        await User.create({
            firstName,
            lastName,
            email,
            age,
            cart: newCart._id,
            password: hashPassword(password)
        });
        console.log('User created!')
        // Send a success response
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        // If an error occurs, return a 500 Internal Server Error response
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Ruta para iniciar la autenticación con GitHub
router.get('/github', passport.authenticate('github'));

// Ruta de callback después de la autenticación con GitHub
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    console.log("Callback User", req.user)
    // Generate and pass Token
    const credentials = { id: req.user._id.toString(), email: req.user.username, role: req.user.role };
    const accessToken = generateToken(credentials)
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 60000 }); // Max age is in milliseconds (1 minute)
    // Redirect the user after successful authentication
    res.redirect('http://localhost:3000/productlist');

});


//router.get('/current', verifyToken, (req, res) => {
router.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
    return res.json(req.user)
});


// Logout route
router.get('/logout', (req, res) => {
    // Clear the JWT token cookie
    res.clearCookie('accessToken');
    // Send a success response
    res.status(200).send('Sesión cerrada con éxito');
});


module.exports = router;