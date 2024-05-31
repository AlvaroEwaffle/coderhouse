// daos/ProductDAO.js
const Product = require('../../models/Products.Model.js');

class ProductDAO {
  async findAll(limit) {
    return await Product.find().limit(parseInt(limit));
  }

  async findById(id) {
    return await Product.findById(id);
  }

  async findOne(query) {
    return await Product.findOne(query);
  }

  async create(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async update(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }

  async findWithFilter(filter, sort, limit, startIndex) {
    let query = Product.find(filter).limit(limit).skip(startIndex);
    if (sort === 'asc') {
      query = query.sort({ price: 1 });
    } else if (sort === 'desc') {
      query = query.sort({ price: -1 });
    }
    return await query.exec();
  }

  async countDocuments(filter) {
    return await Product.countDocuments(filter);
  }
}

module.exports = new ProductDAO();
