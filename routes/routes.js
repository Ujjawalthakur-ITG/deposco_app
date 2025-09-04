const express = require("express");
const {addProduct , addOrder} = require("../contollers/productController")
const router = express.Router();
router.get("/product",addProduct);
router.get("/order",addOrder)
module.exports = router;