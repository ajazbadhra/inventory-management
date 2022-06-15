const Stock = require("../model/stockModel");
const User = require("../model/userModel");

const showStock = async (req, res) => {
  try {
    const stock = await Stock.find({});
    const user = await User.find({});
    res.render("stock", {
      stock,
      userName: user[0].userName,
      companyName: user[0].companyName,
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

module.exports = { showStock };
