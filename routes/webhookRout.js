const express = require("express");
const {webhookCreate } = require("../contollers/webhookController")
const router = express.Router();
router.post("/order-create",webhookCreate)
module.exports = router;