const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE_PATH = path.join(__dirname, 'data', 'productos.json');
const productlist = JSON.parse(fs.readFileSync(PRODUCTS_FILE_PATH, 'utf8'));

// Crear la carpeta 'data' si no existe
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Función para cargar los productos desde el archivo JSON
const loadProducts = () => {
    try {
        const data = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        return [];
    }
};

// Función para guardar los productos en el archivo JSON
const saveProducts = (products) => {
    try {
        const data = JSON.stringify(products, null, 2);
        fs.writeFileSync(PRODUCTS_FILE_PATH, data);
    } catch (error) {
        console.error('Error al guardar productos:', error);
    }
};

//Función para guardar los productos en base de datos mongo


// Controladores
exports.getAllProducts = (req, res) => {
    const products = loadProducts();
    const limit = req.query.limit || products.length;
    res.json(products.slice(0, limit));
};

exports.getProductById = (req, res) => {
    const products = loadProducts();
    const product = products.find(p => p.id === parseInt(req.params.pid));
    if (!product) {
        res.status(404).json({ message: 'Producto no encontrado' });
    } else {
        res.json(product);
    }
};

exports.createProduct = (req, res) => {
    const products = loadProducts();
    const { title, description, code, price, stock, thumbnails } = req.body;
    if (!title || !description || !code || !price || !stock) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    let { status } = req.body;
    //Check if code is unique
    const product = products.find(p => p.code === code);
    if (product) {
        return res.status(400).json({ message: 'El Código ya existe' });
    }
    // Check if status is provided and convert it to a boolean if necessary
    if (status !== undefined) {
        // Convert status to a boolean
        if (status === 'true' || status === true) {
            status = true;
        } else if (status === 'false' || status === false) {
            status = false;
        } else {
            // If status is not a valid boolean, return an error
            return res.status(400).json({ message: 'El campo status debe ser un booleano true o false' });
        }
    } else {
        // Set default value for status if not provided
        status = true;
    }

    const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
        title,
        description,
        code,
        price,
        status,
        stock,
        thumbnails
    };
    products.push(newProduct);
    saveProducts(products); // Guardar productos actualizados en el archivo
    console.log('Se ha agregado un producto:', req.body);
    const socketServer = req.app.get('socketio');
    socketServer.emit('products', newProduct);
    res.status(201).json(newProduct);
};

exports.updateProduct = (req, res) => {
    const products = loadProducts();
    const productId = parseInt(req.params.pid);
    const { title, description, code, price, stock, thumbnails } = req.body;
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    let { status } = req.body;

    // Check if status is provided and convert it to a boolean if necessary
    if (status !== undefined) {
        // Convert status to a boolean
        if (status === 'true' || status === true) {
            status = true;
        } else if (status === 'false' || status === false) {
            status = false;
        } else {
            // If status is not a valid boolean, return an error
            return res.status(400).json({ message: 'El campo status debe ser un booleano' });
        }
    }

    products[productIndex] = {
        ...products[productIndex],
        title: title || products[productIndex].title,
        description: description || products[productIndex].description,
        code: code || products[productIndex].code,
        price: price || products[productIndex].price,
        status: status !== undefined ? status : products[productIndex].status,
        stock: stock || products[productIndex].stock,
        thumbnails: thumbnails || products[productIndex].thumbnails
    };
    saveProducts(products); // Guardar productos actualizados en el archivo
    res.json(products[productIndex]);
};

exports.deleteProduct = (req, res) => {
    const products = loadProducts();
    const productId = parseInt(req.params.pid);
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    products.splice(productIndex, 1);
    saveProducts(products); // Guardar productos actualizados en el archivo
    res.json({ message: 'Producto eliminado correctamente' });
}


