const Supplier = require("../model/supplierModel");
const SupplierPayment = require("../model/supplierPaymentModel");
const Expense = require("../model/expenseModel");
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
  // today = yyyy + "/" + mm + "/" + dd;
  today = `${dd}/${mm}/${yyyy}`;
  return { date: today, time };
};

const showAddSupplier = async (req, res) => {
  try {
    const user = await User.find({});
    res.render("addSupplier", {
      userName: user[0].userName,
      companyName: user[0].companyName,
      msg: req.flash("success"),
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const viewSupplier = async (req, res) => {
  try {
    const user = await User.find({});
    const supplier = await Supplier.find({});
    res.render("viewSupplier", { supplier,userName:user[0].userName, companyName: user[0].companyName});
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const showSupplierPayment = async (req, res) => {
  const { date } = todayDate();
  const user = await User.find({});
  const supplier = await Supplier.find({}).select("-_id name");
  res.render("addSupplierPayment", {
    date,
    supplier,
    userName: user[0].userName,
    companyName: user[0].companyName,
    msg: req.flash("success"),
  });
};

const addSupplier = async (req, res) => {
  try {
    const { name, email, phone, gstno, city, state, landmark } = req.body;
    const supplier = new Supplier({
      name,
      email,
      phone,
      gstno,
      city,
      state,
      landmark,
    });
    req.flash("success", "Supplier Added.... ");

    await supplier.save();
    res.redirect("/supplier/addSupplier");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const dueAmount = async (req, res) => {
  try {
    const dueAmount = await Supplier.findOne({ name: req.body.name }).select(
      "-_id dueAmount"
    );
    res.json({ dueAmount: dueAmount.dueAmount });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const addSupplierPayment = async (req, res) => {
  try {
    const { time } = todayDate();
    const { date, supplierName, pandingAmt, paidAmt, desc } = req.body;
    const supplierPayment = new SupplierPayment({
      date,
      supplierName,
      pandingAmt,
      paidAmt,
      desc,
    });
    await supplierPayment.save();
    await Supplier.findOneAndUpdate(
      { name: supplierName },
      { $inc: { dueAmount: -paidAmt } }
    );

    const expense = new Expense({
      date,
      time,
      name: `Paid to ${supplierName}`,
      amount: paidAmt,
      desc,
    });
    await expense.save();
    req.flash("success", "Supplier Payment Done.... ");

    res.redirect("/supplier/supplierPayment");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const viewSupplierPayment = async (req, res) => {
  try {
    const payment = await SupplierPayment.find({});
    const user = await User.find({});
    res.render("viewSupplierPayment", { payment, userName: user[0].userName, companyName: user[0].companyName});
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const supplierCredit = async (req, res) => {
  try {
    const supplier = await Supplier.find({}).select("-_id name dueAmount");
    const user = await User.find({});
    res.render("supplierCredit", { supplier,userName: user[0].userName, companyName: user[0].companyName});
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

module.exports = {
  showAddSupplier,
  viewSupplier,
  showSupplierPayment,
  addSupplier,
  dueAmount,
  addSupplierPayment,
  viewSupplierPayment,
  supplierCredit,
};
