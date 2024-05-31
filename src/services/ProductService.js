// services/ProductService.js
const ProductRepository = require('../repositories/ProductRepository');
const ProductDTO = require('../dto/ProductDTO');

class ProductService {
  async getAllProducts(limit) {
    const products = await ProductRepository.getAllProducts(limit);
    return products.map(product => new ProductDTO(product));
  }

  async getProductById(id) {
    const product = await ProductRepository.getProductById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return new ProductDTO(product);
  }

  async createProduct(productData) {
    const existingProduct = await ProductRepository.getProductByCode(productData.code);
    if (existingProduct) {
      throw new Error('El código ya existe');
    }

    if (productData.status !== undefined) {
      productData.status = productData.status === 'true' || productData.status === true;
    } else {
      productData.status = true;
    }

    const newProduct = await ProductRepository.createProduct(productData);
    return new ProductDTO(newProduct);
  }

  async updateProduct(id, updateData) {
    const product = await ProductRepository.getProductById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const updatedProduct = await ProductRepository.updateProduct(id, updateData);
    return new ProductDTO(updatedProduct);
  }

  async deleteProduct(id) {
    const product = await ProductRepository.getProductById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    await ProductRepository.deleteProduct(id);
    return { message: 'Producto eliminado correctamente' };
  }

  async getProducts(queryParams) {
    let { limit = 5, page = 1, sort, title, price, code, query } = queryParams;

    limit = parseInt(limit);
    page = parseInt(page);
    const startIndex = (page - 1) * limit;

    let filter = {};
    if (query) {
      filter = JSON.parse(query);
    }
    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    if (price) {
      filter.price = price;
    }
    if (code) {
      filter.code = { $regex: code, $options: 'i' };
    }

    const products = await ProductRepository.getProductsWithFilter(filter, sort, limit, startIndex);
    const totalProducts = await ProductRepository.getTotalProducts(filter);

    return {
      status: 'success',
      payload: products.map(product => new ProductDTO(product)),
      totalPages: Math.ceil(totalProducts / limit),
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < Math.ceil(totalProducts / limit) ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < Math.ceil(totalProducts / limit),
      prevLink: page > 1 ? `?page=${page - 1}&limit=${limit}` : null,
      nextLink: page < Math.ceil(totalProducts / limit) ? `?page=${page + 1}&limit=${limit}` : null,
    };
  }
}

module.exports = new ProductService();
