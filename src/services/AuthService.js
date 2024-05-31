const UserRepository = require('../repositories/UserRepository');
const CartRepository = require('../repositories/CartRepository');
const UserDTO = require('../dto/UserDTO');
const { hashPassword, isValidPassword } = require('../utils/bcrypt.js');
const { generateToken } = require('../utils/jwt.js');

//Login OK
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserRepository.getUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (!isValidPassword(user, password)) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const credentials = { id: user._id.toString(), email: user.email, role: user.role, cart: user.cart };
        const accessToken = generateToken(credentials);
        res.cookie('accessToken', accessToken, { maxAge: 60 * 1000, httpOnly: true });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Register
exports.register = async (req, res) => {
    console.log("--- Service ---");
    const { firstName, lastName, email, age, password } = req.body;
    try {
        const existingUser = await UserRepository.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const newCart = await CartRepository.createCart({ /* cart properties */ });

        // Create a new user in the database wih dto
        const userData = {
            firstName,
            lastName,
            email,
            age,
            cart: newCart._id,
            password: hashPassword(password)
        }
        async function registerUser(userData) {
            console.log("--- registerUser Function ---");
            console.log(userData);
            // Create UserDTO instance correctly
            const user = new UserDTO(userData);
            console.log(user);
            // Call repository method with userDTO
            return await UserRepository.createUser(userData);
        }

        await registerUser(userData);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.githubCallback = (req, res) => {
    const credentials = { id: req.user._id.toString(), email: req.user.username, role: req.user.role };
    const accessToken = generateToken(credentials);
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 60000 });

    res.redirect('http://localhost:3000/productlist');
};

exports.getCurrentUser = (req, res) => {
    return res.json(req.user);
};

exports.logout = (req, res) => {
    res.clearCookie('accessToken');
    res.status(200).send('Sesión cerrada con éxito');
};
