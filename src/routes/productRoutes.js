const express = require("express");
const router = new express.Router();
const {
  showAddProduct,
  viewProduct,
  addProduct,
  getProduct,
  getCustomerProduct,
} = require("../controller/productController");

router.route("/addProduct").get(showAddProduct).post(addProduct);
router.route("/viewProduct").get(viewProduct);
router.route("/getProduct").get(getProduct);
router.post("/getCustomerProduct", getCustomerProduct);

module.exports = router;
