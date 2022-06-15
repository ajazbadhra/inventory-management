const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  productName: {
    type: String,
    require: true,
    unique: true,
  },
  qty: {
    type: Number,
    require: true,
    default: 0,
  },
  purchasePrice: {
    type: Number,
    default: 0,
  },
  storeLocation: {
    type: String,
  },
  minimumStock: {
    type: Number,
    default: 5,
  },
});

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
