const express = require("express");
const {webhookCreate , WebhookShop} = require("../contollers/webhookController")
const router = express.Router();
router.post("/order-create",webhookCreate)
router.post("/shop-update",WebhookShop)
module.exports = router;