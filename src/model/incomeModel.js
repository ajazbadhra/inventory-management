const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
  },
});

const Income = mongoose.model("Income", incomeSchema);
module.exports = Income;
