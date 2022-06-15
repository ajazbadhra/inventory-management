const express = require("express");
const router = new express.Router();
const {
  showAddCustomer,
  viewCustomer,
  showCustomerPayment,
  addCustomer,
  dueAmount,
  addCustomerPayment,
  viewCustomerPayment,
  customerCredit,
} = require("../controller/customerController");

router.route("/addCustomer").get(showAddCustomer).post(addCustomer);
router.route("/viewCustomer").get(viewCustomer);
router
  .route("/customerPayment")
  .get(showCustomerPayment)
  .post(addCustomerPayment);
router.post("/dueAmount", dueAmount);
router.get("/viewCustomerPayment", viewCustomerPayment);
router.get("/customerCredit", customerCredit);
module.exports = router;
