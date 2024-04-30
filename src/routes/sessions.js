const { Router } = require('express')
const User = require('../dao/models/User.Model')
const router = Router()
//Import utils.js
const {hashPassword, isValidPassword} = require('../utils/bcrypt.js')
const passport = require('passport');

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    // 1. verificar que el usuario exista en la BD
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(401).send({ Login: false })
    }
    // 2. crear nueva sesión si el usuario existe
    if(!isValidPassword(user, password)) {res.status(403).send({ Login: false })}
    delete user.password
    req.session.user = user.email
    console.log("User:", req.session.user)
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
router.get('/validate', async (req, res) => {
    console.log("User Session:", req.session.user)
    try {
        // Check if user session exists
        if (req.session.user) {
            // If session exists, it's valid
            if (req.session.user === 'adminCoder@coder.com') {
                res.json({ valid: true, user: req.session.user, userType: 'admin' })
            } else {
                res.json({ valid: true, user: req.session.user, userType: 'usuario' })
            }
        } else {
            // If session doesn't exist, it's invalid
            res.json({ valid: false });
        }
    } catch (error) {
        console.error('Error validating session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Definir la ruta de logout
router.get('/logout', (req, res) => {
    // Eliminar la sesión del usuario
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        res.status(500).send('Error al cerrar sesión');
      } else {
        res.clearCookie('session_id'); // Limpiar la cookie de sesión
        res.status(200).send('Sesión cerrada con éxito');
      }
    });
  });

  // Ruta para iniciar la autenticación con GitHub
router.get('/github', passport.authenticate('github'));

// Ruta de callback después de la autenticación con GitHub
router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // Redirigir al usuario después de la autenticación exitosa
        res.redirect('http://localhost:3000/productlist');
    });

// Ejemplo de ruta protegida
router.get('/profile', ensureAuthenticated, (req, res) => {
    res.send('Welcome to your profile');
});

// Middleware para verificar la autenticación del usuario
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send('User not autenticated');
}


module.exports = router