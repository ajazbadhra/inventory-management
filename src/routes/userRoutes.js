const express = require("express");
const router = new express.Router();
const auth = require("../middlewere/auth");
const {
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
} = require("../controller/userController");

router.route("/").get(showLogin);
router.route("/register").get(showRegister).post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/dashboard").get(auth, showDashboard);
router.route("/income").get(auth, showIncome).post(auth, addIncome);
router.route("/expense").get(auth, showExpense).post(auth, addExpense);
router.get("/showOutOfStock", auth, showOutOfStock);
module.exports = router;
