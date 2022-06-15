const Customer = require("../model/customerModel");
const CustomerPayment = require("../model/customerPaymentModel");
const Income = require("../model/incomeModel");
const SallingPrice = require("../model/salingPriceModel");
const User = require("../model/userModel");

const todayDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var hh = String(today.getHours() % 12 || 12).padStart(2, "0");
  var min = String(today.getMinutes()).padStart(2, "0");
  var suffix = hh >= 12 ? " PM" : " AM";
  var time = hh + ":" + min + suffix;
  today = yyyy + "/" + mm + "/" + dd;
  return { date: today, time };
};
const showAddCustomer = async (req, res) => { 
  try {
    const user = await User.find({});
    res.render("addCustomer", {
      userName: user[0].userName,
      companyName: user[0].companyName,
      msg: req.flash("success"),
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};
const viewCustomer = async (req, res) => {
  try {
    const customer = await Customer.find({});
    const user = await User.find({});
    res.render("viewCustomer", {
      customer,
      userName: user[0].userName,
      companyName: user[0].companyName,
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const showCustomerPayment = async (req, res) => {
  try {
    const { date } = todayDate();
    const user = await User.find({});
    const customer = await Customer.find({}).select("-_id name");
    res.render("addCustomerPayment", {
      date,
      customer,
      userName: user[0].userName,
      companyName: user[0].companyName,
      msg: req.flash("success"),
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const addCustomer = async (req, res) => {
  try {
    const { name, email, phone, gstno, city, state, landmark } = req.body;
    const customer = new Customer({
      name,
      email,
      phone,
      gstno,
      city,
      state,
      landmark,
    });

    // const products = await Product.find({}).select(
    //   "-_id productName sellingPrice"
    // );

    await SallingPrice.insertMany({
      customerName: name,
      products: [],
    });

    await customer.save();
    req.flash("success", "Customer Added.... ");
    res.redirect("/customer/addCustomer");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const dueAmount = async (req, res) => {
  try {
    const dueAmount = await Customer.findOne({ name: req.body.name }).select(
      "-_id dueAmount"
    );
    res.json({ dueAmount: dueAmount.dueAmount });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const addCustomerPayment = async (req, res) => {
  try {
    const { time } = todayDate();
    const { date, customerName, pandingAmt, paidAmt, desc } = req.body;
    const customerPayment = new CustomerPayment({
      date,
      customerName,
      pandingAmt,
      paidAmt,
      desc,
    });
    await customerPayment.save();
    await Customer.findOneAndUpdate(
      { name: customerName },
      { $inc: { dueAmount: -paidAmt } }
    );
    const income = new Income({
      date,
      time,
      name: `${customerName} paid`,
      amount: paidAmt,
      desc: `${customerName} Paid his dues`,
    });
    await income.save();
    req.flash("success", "Customer Payments Done.... ");

    res.redirect("/customer/customerPayment");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const viewCustomerPayment = async (req, res) => {
  try {
    const user = await User.find({});
    const payment = await CustomerPayment.find({});
    res.render("viewCustomerPayment", {
      payment,
      userName: user[0].userName,
      companyName: user[0].companyName,
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const customerCredit = async (req, res) => {
  try {
    const user = await User.find({});
    const customer = await Customer.find({}).select("-_id name dueAmount");
    res.render("customerCredit", {
      customer,
      userName: user[0].userName,
      companyName: user[0].companyName,
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};
module.exports = {
  showAddCustomer,
  viewCustomer,
  showCustomerPayment,
  addCustomer,
  dueAmount,
  addCustomerPayment,
  viewCustomerPayment,
  customerCredit,
};
