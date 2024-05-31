// repositories/ProductRepository.js
const ProductDAO = require('../dao/mongo_dao/ProductsDAO');

class ProductRepository {
  async getAllProducts(limit) {
    return await ProductDAO.findAll(limit);
  }

  async getProductById(id) {
    return await ProductDAO.findById(id);
  }

  async getProductByCode(code) {
    return await ProductDAO.findOne({ code });
  }

  async createProduct(productData) {
    return await ProductDAO.create(productData);
  }

  async updateProduct(id, updateData) {
    return await ProductDAO.update(id, updateData);
  }

  async deleteProduct(id) {
    return await ProductDAO.delete(id);
  }

  async getProductsWithFilter(filter, sort, limit, startIndex) {
    return await ProductDAO.findWithFilter(filter, sort, limit, startIndex);
  }

  async getTotalProducts(filter) {
    return await ProductDAO.countDocuments(filter);
  }
}

module.exports = new ProductRepository();
