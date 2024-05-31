const fs = require('fs');
const path = require('path');

const CARTS_FILE_PATH = path.join(__dirname, '..', 'data', 'carritos.json');

// Función para cargar los carritos desde el archivo JSON
const loadCarts = () => {
    try {
        const data = fs.readFileSync(CARTS_FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar carritos:', error);
        return [];
    }
};

// Función para guardar los carritos en el archivo JSON
const saveCarts = (carts) => {
    try {
        const data = JSON.stringify(carts, null, 2);
        fs.writeFileSync(CARTS_FILE_PATH, data);
    } catch (error) {
        console.error('Error al guardar carritos:', error);
    }
};

// Controladores
exports.createCart = (req, res) => {
    const carts = loadCarts();
    const newCart = {
        id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
        products: []
    };
    carts.push(newCart);
    saveCarts(carts); // Guardar carritos actualizados en el archivo
    res.status(201).json(newCart);
};

exports.getCartById = (req, res) => {
    const carts = loadCarts();
    const cartId = parseInt(req.params.cid);
    const cart = carts.find(c => c.id === cartId);
    if (!cart) {
        res.status(404).json({ message: 'Carrito no encontrado' });
    } else {
        res.json(cart);
    }
};

exports.addProductToCart = (req, res) => {
    const carts = loadCarts();
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = parseInt(req.body.quantity) || 1; // Si no se proporciona la cantidad, establecerla en 1

    const cartIndex = carts.findIndex(c => c.id === cartId);
    if (cartIndex === -1) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    
    // Verificar si el producto ya está en el carrito
    const existingProductIndex = carts[cartIndex].products.findIndex(item => item.productId === productId);
    if (existingProductIndex !== -1) {
        // Si el producto ya existe en el carrito, actualizar la cantidad
        carts[cartIndex].products[existingProductIndex].quantity += quantity;
    } else {
        // Si el producto no existe en el carrito, agregarlo
        carts[cartIndex].products.push({ productId, quantity });
    }
    saveCarts(carts); // Guardar carritos actualizados en el archivo
    res.status(200).json(carts[cartIndex]);
};

//Get al available carts
exports.getAvailableCarts = (req, res) => {
    const carts = loadCarts();
    //const availableCarts = carts.filter(cart => cart.products.length > 0);
    res.json(carts);
};