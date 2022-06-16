const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const Income = require("../model/incomeModel");
const Expense = require("../model/expenseModel");
const jwt = require("jsonwebtoken");
const Sale = require("../model/saleModel");
const Purchase = require("../model/PurchaseModel");
const Product = require("../model/productModel");
const Stock = require("../model/stockModel");
const Customer = require("../model/customerModel");
const Supplier = require("../model/supplierModel");

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

const showLogin = async (req, res) => {
  try {
    const user = await User.find({});
    // console.log(user.length);
    res.render("login", { user, msg: req.flash("success") });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const showRegister = (req, res) => {
  res.render("register");
};

const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      phone,
      cname,
      address,
      city,
      state,
      gst,
      bname,
      bac,
      ifsc,
      branch,
    } = req.body;
    const pass = await bcrypt.hash(password, 12);
    const user = new User({
      userName: username,
      email,
      password: pass,
      phoneNumber: phone,
      companyName: cname,
      address,
      city,
      state,
      gstNo: gst,
      bankName: bname,
      accountNumber: bac,
      ifsc,
      branchName: branch,
    });
    await user.save();
    req.flash("success", "Registered successfully.... ");

    // res.render("login", { msg: req.flash("success") });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const token = jwt.sign(
          {
            email,
            password,
          },
          process.env.SECRET_KEY
        );
        await res.cookie("token", token);
        req.flash("success", "Login successfully.... ");

        res.redirect("/dashboard");
      } else {
        res.send("login failed");
      }
    } else {
      res.send("No user Available");
    }
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token");
    req.flash("success", "Loged Out.... ");
    res.redirect("/");
  } catch (err) {
    res.send(err.message);
    console.log(err);
  }
};

const showDashboard = async (req, res) => {
  try {
    const { date } = todayDate();
    const user = await User.find({});
    const now = new Date();
    const currentFirstDay = new Date(now.getFullYear(), now.getMonth(), 1, 0);
    const currentLastDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const previousFirstDay = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
      0
    );
    const previousLastDay = new Date(
      now.getFullYear(),
      now.getMonth() - 1 + 1,
      1
    );
    //sale------------------------------------
    const currentSale = await Sale.aggregate([
      {
        $match: { date: { $gt: currentFirstDay, $lte: currentLastDay } },
      },
      {
        $group: { _id: null, total: { $sum: "$gTotal" } },
      },
    ]);

    const previousSale = await Sale.aggregate([
      {
        $match: { date: { $gt: previousFirstDay, $lte: previousLastDay } },
      },
      {
        $group: { _id: null, total: { $sum: "$gTotal" } },
      },
    ]);

    const todaySale = await Sale.aggregate([
      {
        $match: { date: new Date(date) },
      },
      {
        $group: { _id: null, total: { $sum: "$gTotal" } },
      },
    ]);
    //end sale

    //purchase----------------------------------
    const currentPurchase = await Purchase.aggregate([
      {
        $match: { date: { $gt: currentFirstDay, $lte: currentLastDay } },
      },
      {
        $group: { _id: null, total: { $sum: "$gTotal" } },
      },
    ]);

    const previousPurchase = await Purchase.aggregate([
      {
        $match: { date: { $gt: previousFirstDay, $lte: previousLastDay } },
      },
      {
        $group: { _id: null, total: { $sum: "$gTotal" } },
      },
    ]);

    const todayPurchase = await Purchase.aggregate([
      {
        $match: { date: new Date(date) },
      },
      {
        $group: { _id: null, total: { $sum: "$gTotal" } },
      },
    ]);
    //end purchase

    //products----------------------------------
    const totalProducts = await Product.find({}).count();

    const outOfStock = await Stock.find({
      $expr: { $lte: ["$qty", "$minimumStock"] },
    });
    //end products

    //customer and supplier ------------------------
    const customer = await Customer.find({}).count();
    const supplier = await Supplier.find({}).count();
    //end customer and supplier

    res.render("dashboard", {
      currentSale: currentSale[0],
      previousSale: previousSale[0],
      todaySale: todaySale[0],
      currentPurchase: currentPurchase[0],
      previousPurchase: previousPurchase[0],
      todayPurchase: todayPurchase[0],
      totalProducts,
      inStock: totalProducts - outOfStock.length,
      outOfStock: outOfStock.length,
      customer,
      supplier,
      userName: user[0].userName,
      companyName: user[0].companyName,
      msg: req.flash("success"),
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const showIncome = async (req, res) => {
  try {
    const { date } = todayDate();
    const user = await User.find({});
    const income = await Income.find({ date });

    res.render("income", {
      date,
      income,
      userName: user[0].userName,
      companyName: user[0].companyName,
      msg: req.flash("success"),
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};
const showExpense = async (req, res) => {
  try {
    const { date } = todayDate();
    const user = await User.find({});
    const expense = await Expense.find({ date });
    res.render("expense", {
      date,
      expense,
      userName: user[0].userName,
      companyName: user[0].companyName,
      msg: req.flash("success"),
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const addIncome = async (req, res) => {
  try {
    const { date, name, amount, desc } = req.body;
    const { time } = todayDate();
    const income = new Income({
      date,
      time,
      name,
      amount,
      desc,
    });
    await income.save();
    req.flash("success", "Income Added.... ");

    res.redirect("/income");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const addExpense = async (req, res) => {
  try {
    const { date, name, amount, desc } = req.body;
    const { time } = todayDate();
    const expense = new Expense({
      date,
      time,
      name,
      amount,
      desc,
    });
    await expense.save();
    req.flash("success", "Expense Added.... ");

    res.redirect("/expense");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const showOutOfStock = async (req, res) => {
  try {
    const user = await User.find({});
    const outOfStock = await Stock.find({
      $expr: { $lte: ["$qty", "$minimumStock"] },
    });
    res.render("outOfStock", {
      outOfStock,
      userName: user[0].userName,
      companyName: user[0].companyName,
    });
  } catch (err) {
    console.log(err);
    re.send(err.message);
  }
};

module.exports = {
  showLogin,
  showRegister,
  register,
  login,
  showDashboard,
  showIncome,
  showExpense,
  addIncome,
  addExpense,
  logout,
  showOutOfStock,
};
