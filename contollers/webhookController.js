require("dotenv").config();
const axios = require("axios");

const webhookCreate = async (req, res) => {
    console.log("🎉 Received an order update webhook!");
    console.log(req.body);

    try {
        const shopifyOrder = req.body;

        const deposcoPayload = {
            order: [
                {
                    businessUnit: "FIREQUOCF_OCF",
                    shipFromFacility:"OCF",
                    number: `PO_${shopifyOrder.order_number}`,
                    otherReferenceNumber: shopifyOrder.id.toString(),
                    customerOrderNumber: shopifyOrder.name,
                    type: shopifyOrder.payment_terms?.payment_terms_type === "net" ? "Partially Paid": "Purchase Order",
                    status: "New",
                    tradingPartner: "SHOPIFY_SUPPLIER",
                    orderSource: "shopify",
                    shipVia: shopifyOrder.shipping_lines[0]?.title || "",
                    shipTo: "FAC001",
                    billToAddress: {
                        name:
                            shopifyOrder.billing_address?.name ||
                            `${shopifyOrder.billing_address?.first_name || ""} ${shopifyOrder.billing_address?.last_name || ""}`,
                        address: {
                            line1: shopifyOrder.billing_address?.address1 || "Unknown Street",
                            line2: shopifyOrder.billing_address?.address2 || "",
                            city: shopifyOrder.billing_address?.city || "Unknown City",
                            stateProvinceCode: shopifyOrder.billing_address?.province_code || "XX",
                            postalCode: shopifyOrder.billing_address?.zip || "00000",
                            countryCode: shopifyOrder.billing_address?.country_code || "US",
                        },
                        phone1: shopifyOrder.billing_address?.phone || shopifyOrder.phone || "",
                    },

                    shipFromAddress: {},

                    shipToAddress: {
                        name:
                            shopifyOrder.shipping_address?.name ||
                            `${shopifyOrder.shipping_address?.first_name || ""} ${shopifyOrder.shipping_address?.last_name || ""}`,
                        address: {
                            line1: shopifyOrder.shipping_address?.address1 || "Unknown Street",
                            line2: shopifyOrder.shipping_address?.address2 || "",
                            city: shopifyOrder.shipping_address?.city || "Unknown City",
                            stateProvinceCode: shopifyOrder.shipping_address?.province_code || "XX",
                            postalCode: shopifyOrder.shipping_address?.zip || "00000",
                            countryCode: shopifyOrder.shipping_address?.country_code || "US",
                        },
                        phone1: shopifyOrder.shipping_address?.phone || shopifyOrder.phone || "",
                    },

                    createdDateTime: shopifyOrder.created_at,
                    placedDate: shopifyOrder.created_at,
                    plannedShipDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                    plannedArrivalDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    actualArrivalDate: null,

                    customFields: [
                        {
                            name: "Pick Wave - Number",
                            value: "",
                            type: "String",
                        },
                    ],

                    notes:
                        shopifyOrder.fulfillments.length > 0
                            ? {
                                note: shopifyOrder.fulfillments.map((f, index) => ({
                                    title: `Tracking Link ${index + 1}`,
                                    body: f.tracking_url || "",
                                })),
                            }
                            : null,

                    orderLines: shopifyOrder.line_items.map((item, index) => ({
                        lineNumber: `${shopifyOrder.order_number}--${index + 1}`,
                        customerLineNumber:(index + 1).toString(),
                        lineStatus: "New",
                        itemNumber: item.sku || `ITEM_${index + 1}`,
                        pack: {
                            type: "Each",
                            quantity: item.quantity || 1,
                        },
                        orderPackQuantity: item.quantity || 1,
                        unitPrice: parseFloat(item.price) || 0,
                        discountAmount: item.total_discount
                            ? parseFloat(item.total_discount) / (item.quantity || 1)
                            : 0,
                        taxable: item.taxable,
                    })),
                },
            ],
        };

        let deposcoResponse;
        try {
            deposcoResponse = await axios.post(
                "https://api.deposco.com/integration/RLL/orders",
                deposcoPayload,
                {
                    headers: {
                        Authorization: "Basic cmNhbWJpYXM6RmVxZDIwMjUh",
                        "X-Tenant-Code": "RLL",
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );

            console.log("Deposco API Response (Create):", deposcoResponse.data);

            // Check if Deposco response itself says duplicate
            if (
                deposcoResponse.data?.response?.status === "HTTP/1.1 409 Conflict"
            ) {
                console.log("Duplicate order found, trying update...");
                try {
                    deposcoResponse = await axios.post(
                        "https://api.deposco.com/integration/RLL/orders/updates",
                        deposcoPayload,
                        {
                            headers: {
                                Authorization: "Basic cmNhbWJpYXM6RmVxZDIwMjUh",
                                "X-Tenant-Code": "RLL",
                                "Content-Type": "application/json",
                                Accept: "application/json",
                            },
                        }
                    );
                    console.log("Deposco API Response (Update):", deposcoResponse.data);
                } catch (updateError) {
                    console.error(
                        "Error updating in Deposco:",
                        updateError.response ? updateError.response.data : updateError.message
                    );
                }
            }

        } catch (createError) {
            console.log("Error in Create:", createError.response?.data || createError.message);
        }

    } catch (error) {
        console.error("Unexpected error in webhook:", error.message);
    }

    res.status(200).send("Webhook received");
};

module.exports = { webhookCreate};
