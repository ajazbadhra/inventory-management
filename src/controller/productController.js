const Supplier = require("../model/supplierModel");
const Product = require("../model/productModel");
const Stock = require("../model/stockModel");
const SallingPrice = require("../model/salingPriceModel");
const User = require("../model/userModel");

const showAddProduct = async (req, res) => {
  const supplier = await Supplier.find({}).select("name -_id");
  const user = await User.find({});
  res.render("addProduct", {
    supplier,
    userName: user[0].userName,
    companyName: user[0].companyName,
    msg: req.flash("success"),
  });
};

const viewProduct = async (req, res) => {
  try {
    const product = await Product.find({});
    const user = await User.find({});
    res.render("viewProduct", {
      product,
      userName: user[0].userName,
      companyName: user[0].companyName,
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      unit,
      sellingPrice,
      minimumStock,
      supplier,
      storeLocation,
    } = req.body;

    const product = new Product({
      productName,
      category,
      unit,
      sellingPrice,
      minimumStock,
      supplier,
      storeLocation,
    });

    const stock = new Stock({
      productName,
      storeLocation,
      minimumStock,
    });

    await product.save();
    await stock.save();

    req.flash("success", "Product Added.... ");

    // const products = await Product.find({}).select(
    //   "-_id productName sellingPrice"
    // );
    // await SallingPrice.updateMany({
    //   products,
    // });

    res.redirect("/product/addProduct");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.find({});
    const stock = await Stock.find({}).select("-_id productName qty");
    res.json({ product, stock });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const getCustomerProduct = async (req, res) => {
  try {
    const cProduct = await SallingPrice.findOne({
      customerName: req.body.cname,
    }).select("-_id products");
    res.json({ cProduct });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};
module.exports = {
  showAddProduct,
  viewProduct,
  addProduct,
  getProduct,
  getCustomerProduct,
};
