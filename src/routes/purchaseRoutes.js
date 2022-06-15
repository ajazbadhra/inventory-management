const express = require("express");
const router = new express.Router();
const {
  showAddPurchase,
  viewPurchase,
  getState,
  getCount,
  addPurchase,
  purchaseInvoice,
} = require("../controller/purchaseController");

router.route("/addPurchase").get(showAddPurchase).post(addPurchase);
router.route("/viewPurchase").get(viewPurchase);
router.post("/getState", getState);
router.post("/count", getCount);
router.get("/purchaseInvoice/:bill", purchaseInvoice);
module.exports = router;
