const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    unique: true,
    require: true,
  },
  category: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  minimumStock: {
    type: Number,
    default: 5,
    required: true,
  },
  supplier: {
    type: String,
    required: true,
  },
  storeLocation: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
