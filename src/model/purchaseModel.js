const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  billNo: {
    type: Number,
    required: true,
    unique: true,
  },
  date: {
    type: String,
    required: true,
  },
  supplierName: {
    type: String,
    required: true,
  },
  purchaseProducts: [
    {
      hsn: {
        type: String,
        required: true,
      },
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
      gstp: {
        type: Number,
        default: 0,
        required: true,
      },
      gstAmt: {
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
  cgst: {
    type: Number,
    default: 0,
  },
  sgst: {
    type: Number,
    default: 0,
  },
  igst: {
    type: Number,
    default: 0,
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

const Purchase = mongoose.model("Purchase", purchaseSchema);
module.exports = Purchase;
