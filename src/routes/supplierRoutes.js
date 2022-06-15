const express = require("express");
const router = new express.Router();
const {
  showAddSupplier,
  viewSupplier,
  showSupplierPayment,
  addSupplier,
  dueAmount,
  addSupplierPayment,
  viewSupplierPayment,
  supplierCredit,
} = require("../controller/supplierController");

router.route("/addSupplier").get(showAddSupplier).post(addSupplier);
router.route("/viewSupplier").get(viewSupplier);
router
  .route("/supplierPayment")
  .get(showSupplierPayment)
  .post(addSupplierPayment);
router.post("/dueAmount", dueAmount);
router.get("/viewSupplierPayment", viewSupplierPayment);
router.get("/supplierCredit", supplierCredit);

module.exports = router;
