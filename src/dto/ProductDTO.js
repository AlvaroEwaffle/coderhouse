// dtos/ProductDTO.js
class ProductDTO {
    constructor({ id, title, description, code, price, stock, thumbnails }) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.code = code;
      this.price = price;
      this.stock = stock;
      this.thumbnails = thumbnails;
    }
  }
  
  module.exports = ProductDTO;
  