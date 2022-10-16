const express = require("express");
const router = new express.Router();
const {
  showAddSale,
  viewSale,
  getOldAmt,
  addSale,
  getCount,
  invoice,
} = require("../controller/saleController");

router.route("/addSale").get(showAddSale).post(addSale);
router.route("/viewSale").get(viewSale);
router.route("/getOldAmt").post(getOldAmt);
router.post("/count", getCount);
router.get("/invoice", invoice);

module.exports = router;
