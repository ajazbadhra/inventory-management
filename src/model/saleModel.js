const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  billNo: {
    type: Number,
    required: true,
    unique: true,
  },
  date: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  saleProducts: [
    {
      productName: {
        type: String,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
      rate: {
        type: Number,
        default: 0,
        required: true,
      },
      qty: {
        type: Number,
        default: 0,
        required: true,
      },
      dis: {
        type: Number,
        default: 0,
        required: true,
      },
      netRate: {
        type: Number,
        default: 0,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  oldAmt: {
    type: Number,
    required: true,
  },
  roff: {
    type: Number,
    default: 0,
  },
  gTotal: {
    type: Number,
    required: true,
  },
});

const Sale = mongoose.model("Sale", saleSchema);
module.exports = Sale;
