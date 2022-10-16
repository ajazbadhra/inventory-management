const User = require("../model/userModel");
const Supplier = require("../model/supplierModel");
const Product = require("../model/productModel");
const Purchase = require("../model/PurchaseModel");
const rtw = require("convert-rupees-into-words");
const Stock = require("../model/stockModel");

const todayDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  // today = yyyy + "/" + mm + "/" + dd;
  today = `${dd}/${mm}/${yyyy}`;
  return today;
};
var count = 0;
const getCount = (req, res) => {
  count = req.body.count;
  res.json(count);
};

const showAddPurchase = async (req, res) => {
  try {
    const date = todayDate();
    const user = await User.find({});
    let billNo = await Purchase.findOne()
      .sort({ $natural: -1 })
      .limit(1)
      .select("billNo -_id");

    billNo = billNo ? Number(billNo.billNo) + 1 : 1;
    const supplier = await Supplier.find({}).select("-_id name");
    const product = await Product.find({});
    res.render("addPurchase", {
      date,
      product,
      supplier,
      billNo,
      userName: user[0].userName,
      companyName: user[0].companyName,
      msg: req.flash("success"),
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const viewPurchase = async (req, res) => {
  try {
    const user = await User.find({});
    const bill = await Purchase.find({}).select(
      "billNo date supplierName gTotal -_id"
    );
    res.render("viewPurchase", {
      bill,
      userName: user[0].userName,
      companyName: user[0].companyName,
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const getState = async (req, res) => {
  try {
    const supplier_state = await Supplier.findOne({
      name: req.body.sname,
    }).select("-_id state");
    const profile_state = await User.find({}).select("state -_id");
    res.json({ profile_state, supplier_state });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const addPurchase = async (req, res) => {
  try {
    const products = [];
    for (i = 0; i < count; i++) {
      const p = {
        hsn: req.body[`hsn${i}`],
        productName: req.body[`prod${i}`],
        unit: req.body[`unit${i}`],
        rate: req.body[`rate${i}`],
        qty: req.body[`qty${i}`],
        gstp: req.body[`gstp${i}`],
        gstAmt: req.body[`gstamt${i}`],
        total: req.body[`tot${i}`],
      };
      products.push(p);
      await Stock.findOneAndUpdate(
        { productName: req.body[`prod${i}`] },
        {
          $inc: { qty: req.body[`qty${i}`] },
          $set: { purchasePrice: req.body[`rate${i}`] },
        }
      );
    }

    const { billNo, date, supplier, total, cgst, sgst, igst, roff, gtot } =
      req.body;
    await Purchase.insertMany({
      billNo,
      date,
      supplierName: supplier,
      purchaseProducts: products,
      total,
      cgst: cgst || 0,
      sgst: sgst || 0,
      igst: igst || 0,
      roff: roff || 0,
      gTotal: gtot,
    });
    await Supplier.findOneAndUpdate(
      { name: supplier },
      { $inc: { dueAmount: gtot } }
    );
    req.flash("success", "Purchase Added.... ");

    res.redirect("/purchase/addPurchase");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const purchaseInvoice = async (req, res) => {
  try {
    const {
      billNo,
      date,
      supplierName,
      purchaseProducts,
      total,
      cgst,
      sgst,
      igst,
      roff,
      gTotal,
    } = await Purchase.findOne({ billNo: req.params.bill });
    const word = rtw(Number(gTotal));
    const user = await User.findOne().sort({
      $natural: -1,
    });
    const supplier = await Supplier.findOne({ name: supplierName });

    res.render("purchaseInvoice", {
      billNo,
      date,
      supplierName,
      purchaseProducts,
      total,
      cgst,
      sgst,
      igst,
      roff,
      gTotal,
      user,
      supplier,
      word,
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};
module.exports = {
  showAddPurchase,
  viewPurchase,
  getState,
  getCount,
  addPurchase,
  purchaseInvoice,
};
