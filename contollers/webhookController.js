
require("dotenv").config();
const axios = require("axios");
const webhookCreate = async (req, res) => {
        console.log('🎉 Received an order update webhook!');
        console.log(req.body);
        res.status(200).send('Webhook received');
    }
module.exports = {webhookCreate}
