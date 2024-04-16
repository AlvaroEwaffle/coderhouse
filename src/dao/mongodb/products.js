const Product = require('../models/Products.Model.js');

// Controladores
exports.getAllProductsOLD = async (req, res) => {
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

// Controlador para obtener todos los productos con opciones de paginación, ordenamiento y consulta
exports.getAllProducts = async (req, res) => {
  try {
    let { limit = 5, page = 1, sort, query } = req.query;

    // Convertir limit y page a números enteros
    limit = parseInt(limit);
    page = parseInt(page);

    // Calcular el índice de inicio y el índice de fin para la paginación
    const startIndex = (page - 1) * limit;

    // Crear objeto de filtro vacío inicial
    let filter = {};

    // Agregar filtro de búsqueda si se proporciona una consulta
    if (query) {
      filter = JSON.parse(query); // Convertir el string de consulta JSON a objeto
    }

    // Realizar la consulta a la base de datos con los filtros, paginación y ordenamiento
    let products;
    if (sort === 'asc') {
      products = await Product.find(filter)
        .sort({ price: 1 }) // Ordenamiento ascendente por precio
        .limit(limit) // Límite opcional de elementos por página
        .skip(startIndex) // Saltar los elementos de las páginas anteriores
        .exec();
    } else if (sort === 'desc') {
      products = await Product.find(filter)
        .sort({ price: -1 }) // Ordenamiento descendente por precio
        .limit(limit) // Límite opcional de elementos por página
        .skip(startIndex) // Saltar los elementos de las páginas anteriores
        .exec();
    } else {
      products = await Product.find(filter)
        .limit(limit) // Límite opcional de elementos por página
        .skip(startIndex) // Saltar los elementos de las páginas anteriores
        .exec();
    }

    // Contar el total de productos sin paginación para enviar en la respuesta
    const totalProducts = await Product.countDocuments(filter);

    // Crear objeto de respuesta con los productos y metadatos de paginación
    const response = {
      status: 'success',
      payload: products,
      totalPages: Math.ceil(totalProducts / limit),
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < Math.ceil(totalProducts / limit) ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < Math.ceil(totalProducts / limit),
      prevLink: page > 1 ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${page - 1}&limit=${limit}` : null,
      nextLink: page < Math.ceil(totalProducts / limit) ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${page + 1}&limit=${limit}` : null
    };


    // Enviar respuesta al cliente
    res.json(response);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
