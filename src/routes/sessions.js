const { Router } = require('express')
const User = require('../dao/models/User.Model')
const router = Router()
//Import utils.js
const { hashPassword, isValidPassword } = require('../utils/bcrypt.js')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const secretKey = 'tu_clave_secreta';

router.post('/login', async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body
    // 1. verificar que el usuario exista en la BD
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(401).send({ Login: false })
    }
    // 2. crear nueva sesión si el usuario existe
    if (!isValidPassword(user, password)) { res.status(403).send({ Login: false }) }
    delete user.password
    console.log(user)
    const token = generateToken(user);
    console.log("User Token:", token)
    // Set JWT token as a cookie
    res.cookie('jwt', token, { httpOnly: true, maxAge: 60000 }); // Max age is in milliseconds (1 minute)
    // Res status ok and redirect to index
    res.status(200).send({ Login: true })
})

router.post('/register', async (req, res) => {
    console.log(req.body)
    const { firstName, lastName, email, age, password } = req.body
    try {
        await User.create({
            firstName,
            lastName,
            age: +age,
            email,
            password: hashPassword(password)
        })
        console.log('User created!')
        res.status(201).send('User created!')
    }
    catch (err) {
        console.log(err)
        res.status(400).send('Error creating user!')
    }
})

//Validate session
router.post('/validate', async (req, res) => {
    try {
        const token = req.cookies.jwt;
        console.log("User Token:", token)
        const jwtToken = req.cookies.jwt;
        //Si no viene token, devuelve error
        if (!jwtToken) {
            console.log("No token provided");
            res.json({ valid: false });
            return;
        }
        // Verify and decode the JWT token
        let decodedToken;
        try {
            decodedToken = jwt.verify(jwtToken, secretKey);
            console.log('Decoded token:', decodedToken);
        } catch (error) {
            console.log('Error decoding token:', error);
            return res.json({ valid: false });
        }
        // Check if the decoded token has email
        const userEmail = decodedToken.email;
        if (!userEmail) {
            console.log("Email not found");
        }

        // Determine user type based on email
        const userType = (userEmail === 'adminCoder@coder.com') ? 'admin' : 'usuario';

        // Return response with valid status and user data
        res.json({ valid: true, user: decodedToken.username, userType });
    }
    catch (error) {
        console.error('Error validating session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Definir la ruta de logout
router.get('/logout', (req, res) => {
    // Clear the JWT token cookie
    res.clearCookie('jwt');
    console.log("Logout realizado")
    // Send a success response
    res.status(200).send('Sesión cerrada con éxito');
});

// Ruta para iniciar la autenticación con GitHub
router.get('/github', passport.authenticate('github'));

// Ruta de callback después de la autenticación con GitHub
router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        const token = generateToken(req.user);
        // Set JWT token as a cookie
        res.cookie('jwt', token, { httpOnly: true, maxAge: 60000 }); // Max age is in milliseconds (1 minute)
        // Redirect the user after successful authentication
        res.redirect('http://localhost:3000/productlist');

    });

// Ejemplo de ruta protegida
router.get('/profile', async (req, res) => {
    console.log("User Session:", req.session)
    res.send('Welcome to your profile');
});

// Función para generar un token JWT
const generateToken = (userData) => {
    const payload = {
        userId: userData._id,
        username: userData.username,
        email: userData.email
        // Puedes incluir más información del usuario aquí si es necesario
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // El token expira en 1 hora
    return token;
};



module.exports = router