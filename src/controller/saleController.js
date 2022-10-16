const Customer = require("../model/customerModel");
const Product = require("../model/productModel");
const User = require("../model/userModel");
const Sale = require("../model/saleModel");
const rtw = require("convert-rupees-into-words");
const Stock = require("../model/stockModel");
const SallingPrice = require("../model/salingPriceModel");

const todayDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  // today = yyyy + "/" + mm + "/" + dd;
  today = `${dd}/${mm}/${yyyy}`
  return today;
};
var count = 0;
const getCount = (req, res) => {
  count = req.body.count;
};
const showAddSale = async (req, res) => {
  try {
    const date = todayDate();
    const user = await User.find({});
    let billNo = await Sale.findOne()
      .sort({ $natural: -1 })
      .limit(1)
      .select("billNo -_id");

    billNo = billNo ? Number(billNo.billNo) + 1 : 1;
    const customer = await Customer.find({}).select("-_id name");
    const product = await Product.find({});
    res.render("addSale", {
      customer,
      product,
      date,
      billNo,
      userName: user[0].userName,
      companyName: user[0].companyName,
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};
const viewSale = async (req, res) => {
  try {
    const user = await User.find({});
    const bill = await Sale.find({}).select(
      "billNo date customerName gTotal -_id"
    );
    res.render("viewSale", {
      bill,
      userName: user[0].userName,
      companyName: user[0].com,
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const getOldAmt = async (req, res) => {
  try {
    const oldAmt = await Customer.findOne({
      name: req.body.cname,
    }).select("-_id dueAmount");
    // const profile_state = await User.find({}).select("state -_id");
    res.json({ oldAmt });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const addSale = async (req, res) => {
  try {
    const products = [];
    const sp = [];
    for (i = 0; i < count; i++) {
      const p = {
        productName: req.body[`prod${i}`],
        unit: req.body[`unit${i}`],
        rate: req.body[`rate${i}`],
        qty: req.body[`qty${i}`],
        dis: req.body[`dis${i}`],
        netRate: req.body[`nr${i}`],
        total: req.body[`tot${i}`],
      };
      const pr = {
        productName: req.body[`prod${i}`],
        sellingPrice: req.body[`rate${i}`],
      };
      products.push(p);
      sp.push(pr);
      await Stock.findOneAndUpdate(
        { productName: req.body[`prod${i}`] },
        { $inc: { qty: -req.body[`qty${i}`] } }
      );
    }
    const { billNo, date, customer, total, oldAmt, roff, gtot } =
      req.body;
    await Sale.insertMany({
      billNo,
      date,
      customerName: customer,
      saleProducts: products,
      total,
      oldAmt: oldAmt || 0,
      roff: roff || 0,
      gTotal: gtot,
    });
    await Customer.findOneAndUpdate(
      { name: customer },
      { $inc: { dueAmount: gtot } }
    );

    sp.map(async (p) => {
      const n = await SallingPrice.updateOne(
        { customerName: customer, "products.productName": p.productName },
        {
          $set: { "products.$.sellingPrice": p.sellingPrice },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (n.matchedCount == 0) {
        await SallingPrice.updateOne(
          { customerName: customer },
          {
            $push: {
              products: {
                productName: p.productName,
                sellingPrice: p.sellingPrice,
              },
            },
          }
        );
      }
    });
    req.flash("success", "Sale Added.... ");

    res.redirect("/sale/invoice");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const invoice = async (req, res) => {
  try {
    if (req.query.bill) {
      const {
        billNo,
        date,
        customerName,
        saleProducts,
        total,
        oldAmt,
        roff,
        gTotal,
      } = await Sale.findOne({ billNo: req.query.bill });
      const word = rtw(Number(gTotal));
      const user = await User.findOne().sort({
        $natural: -1,
      });
      const customer = await Customer.findOne({ name: customerName });

      res.render("invoice", {
        billNo,
        date,
        customerName,
        saleProducts,
        total,
        oldAmt,
        roff,
        gTotal,
        user,
        customer,
        word,
        msg: req.flash("success"),
      });
    } else {
      const {
        billNo,
        date,
        customerName,
        saleProducts,
        total,
        oldAmt,
        roff,
        gTotal,
      } = await Sale.findOne().sort({ $natural: -1 });
      const word = rtw(Number(gTotal));
      const user = await User.findOne().sort({
        $natural: -1,
      });
      const customer = await Customer.findOne({ name: customerName });

      res.render("invoice", {
        billNo,
        date,
        customerName,
        saleProducts,
        total,
        oldAmt,
        roff,
        gTotal,
        user,
        customer,
        word,
        msg: req.flash("success"),
      });
    }
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

module.exports = {
  showAddSale,
  viewSale,
  getOldAmt,
  addSale,
  getCount,
  invoice,
};
