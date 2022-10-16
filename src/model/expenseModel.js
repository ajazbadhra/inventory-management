const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
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
  }
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
