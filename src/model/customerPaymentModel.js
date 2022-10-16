const mongoose = require("mongoose");

const customerPaymentSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  customerName: {
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

const CustomerPayment = mongoose.model(
  "CustomerPayment",
  customerPaymentSchema
);
module.exports = CustomerPayment;
