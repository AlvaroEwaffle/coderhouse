const Product = require('../models/Products.Model.js');

// Controladores
exports.getAllProducts = async (req, res) => {
  try {
    const limit = req.query.limit || 0;
    const products = await Product.find().limit(parseInt(limit));
    res.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, code, price, stock, thumbnails } = req.body;
    let { status } = req.body;

    // Validación de campos requeridos
    if (!title || !description || !code || !price || !stock) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Verificación de unicidad del código
    const existingProduct = await Product.findOne({ code });
    if (existingProduct) {
      return res.status(400).json({ message: 'El código ya existe' });
    }

    // Conversión de status a booleano si es necesario
    if (status !== undefined) {
      status = status === 'true' || status === true;
    } else {
      status = true;
    }

    // Crear nuevo producto
    const newProduct = new Product({
      title,
      description,
      code,
      price,
      status,
      stock,
      thumbnails
    });

    await newProduct.save();

    console.log('Se ha agregado un producto:', newProduct);
    const socketServer = req.app.get('socketio');
    socketServer.emit('products', newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al agregar un producto:', error);
    res.status(500).json({ message: error });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    
    const { title, description, code, price, stock, thumbnails } = req.body;
    const product = await Product.findById(req.params.pid);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Actualizar campos
    product.title = title || product.title;
    product.description = description || product.description;
    product.code = code || product.code;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.thumbnails = thumbnails || product.thumbnails;

    // Guardar el producto actualizado
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.pid);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
