require("dotenv").config();
const axios = require("axios");

const webhookCreate = async (req, res) => {
  console.log('🎉 Received an order update webhook!');
  console.log(req.body);

  try {
    // Extract Shopify order data
    const shopifyOrder = req.body;

    // Map Shopify data to Deposco Purchase Order API format
    const deposcoPayload = {
        order: [
          {
            businessUnit: "FIREQUOCF_OCF",
            number: `PO_${shopifyOrder.order_number}` || "#0001", // e.g., PO_1084
            otherReferenceNumber: shopifyOrder.id.toString(), // Shopify order ID
            type: "Purchase Order",
            status: "New",
            tradingPartner: "SHOPIFY_SUPPLIER", // Default, update if specific supplier
            shipFromAddress: {
              name: "Shopify Vendor",
              address: {
                line1: shopifyOrder.billing_address?.address1 || "Unknown Street",
                city: shopifyOrder.billing_address?.city || "Unknown City",
                stateProvinceCode: shopifyOrder.billing_address?.province_code || "XX",
                postalCode: shopifyOrder.billing_address?.zip || "00000",
                countryCode: shopifyOrder.billing_address?.country_code || "US"
              }
            },
            shipTo: "01", // Assume facility 01, update as needed
            shipToAddress: {
              name: "Deposco Facility",
              address: {
                line1: "456 Facility Ave",
                city: "Facility City",
                stateProvinceCode: "NY",
                postalCode: "10001",
                countryCode: "US"
              }
            },
            createdDateTime: shopifyOrder.created_at,
            plannedArrivalDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            orderLines: shopifyOrder.line_items.map((item, index) => ({
              lineNumber: `${shopifyOrder.order_number}--${index + 1}`,
              customerLineNumber: (index + 1).toString(),
              lineStatus: "New",
              itemNumber: item.sku || `ITEM_${index + 1}`, // Map SKU or generate dummy
              pack: {
                type: "Each",
                quantity: item.quantity || 1
              },
              orderPackQuantity: item.quantity || 1
            }))
          }
        ]
    };

    // Send to Deposco API
    const deposcoResponse = await axios.post(
      `https://api.deposco.com/integration/RLL/orders`,
      deposcoPayload,
      {
        headers: {
          Authorization: "Basic cmNhbWJpYXM6RmVxZDIwMjUh", // Base64 encoded rcambias:Feqd2025!
          "X-Tenant-Code": "RLL",
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    );

    console.log('Deposco API Response:', deposcoResponse.data);
  } catch (error) {
    console.error('Error sending to Deposco:', error.response?.data || error.message);
  }

  res.status(200).send('Webhook received');
};

module.exports = { webhookCreate };