const mongoose = require("mongoose");

const sallingPriceSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  products: [
    {
      productName: {
        type: String,
        required: true,
      },
      sellingPrice: {
        type: Number,
        required: true,
      },
    },
  ],
});

const SallingPrice = mongoose.model("SallingPrice", sallingPriceSchema);

module.exports = SallingPrice;
