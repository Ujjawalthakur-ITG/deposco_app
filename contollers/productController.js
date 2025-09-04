// server.js
require("dotenv").config();
const axios = require("axios");
// const { Buffer } = require("buffer"); // Optional, Node me built-in hai
const { syncProductsToMongo } = require("../utils/productUtils");
const addProduct = async (req, res) => {
  try {
    await syncProductsToMongo();
    res.send("Products synced to MongoDB!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error syncing products");
  }
}

const addOrder =  (async () => {
  const BASE_URL = "https://api.deposco.com"; // No trailing slash
const CODE = "RLL";
const USERNAME = "rcambias";
const BUSINESS_UNIT = "FIREQUOCF_OCF";
const PASSWORD = "Feqd2025!";
const orderNumber = "1012--6117239652454";
const API_URL = `${BASE_URL}/integration/${CODE}/orders/${BUSINESS_UNIT}/Sales Order/${orderNumber}`
  try {
    const auth = `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`;
    console.log("Auth Header:", auth);

    const response = await axios.get(API_URL, {
      headers: {
        "Authorization": auth, 
        "X-Tenant-Code": `${CODE}`,
        "Accept": "application/json",
      },
    });

    console.log("Connected to Deposco:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error Status:", error.response.status);
      console.error("Error Headers:", error.response.headers);
      console.error("Error Body:", error.response.data);
    } else {
      console.error("Error Message:", error.message);
    }
  }
});

module.exports = {addProduct , addOrder}
