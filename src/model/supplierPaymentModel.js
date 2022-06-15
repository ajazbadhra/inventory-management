const mongoose = require("mongoose");

const SupplierPaymentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  supplierName: {
    type: String,
    require: true,
  },
  pandingAmt: {
    type: Number,
    required: true,
  },
  paidAmt: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
  },
});

const SupplierPayment = mongoose.model(
  "SupplierPayment",
  SupplierPaymentSchema
);
module.exports = SupplierPayment;
