require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const auth = require("./middlewere/auth");
const cookie = require("cookie-parser");
const flash = require("connect-flash");
var cookieSession = require("cookie-session");

const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const productRoutes = require("./routes/productRoutes");
const saleRoutes = require("./routes/saleRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const stockRoutes = require("./routes/stockRoutes");

const PORT = process.env.PORT || 8000;
const templatesPath = path.join(__dirname, "/templates/views");
const staticPath = path.join(__dirname, "/public");
const partialsPath = path.join(__dirname, "/templates/partials");
require("./db/conn");

app.use(
  cookieSession({
    name: "session",
    keys: ["keyboard cat"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(flash());
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: false }));
app.use(cookie());

hbs.registerHelper("inc", function (number, options) {
  if (typeof number === "undefined" || number === null) return null;

  // Increment by inc parameter if it exists or just by one
  return number + (options.hash.inc || 1);
});
app.set("view engine", "hbs");
app.set("views", templatesPath);
app.set(hbs.registerPartials(partialsPath));

app.use("/", userRoutes);
app.use("/customer", auth, customerRoutes);
app.use("/supplier", auth, supplierRoutes);
app.use("/product", auth, productRoutes);
app.use("/sale", auth, saleRoutes);
app.use("/purchase", auth, purchaseRoutes);
app.use("/stock", auth, stockRoutes);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
