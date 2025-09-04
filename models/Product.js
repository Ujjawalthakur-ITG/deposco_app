// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true }, // Shopify product id
  title: String,
  handle: String,
  vendor: String,
  productType: String,
  status: String,
  tags: [String],
  createdAt: Date,
  updatedAt: Date,
  publishedAt: Date,
  options: [
    {
      name: String,
      values: [String],
    },
  ],
  variants: [
    {
      variantId: String,
      title: String,
      sku: String,
      price: String,
      compareAtPrice: String,
      inventoryQuantity: Number,
      availableForSale: Boolean,
      barcode: String,
      image: {
        url: String,
        altText: String,
      },
      selectedOptions: [
        {
          name: String,
          value: String,
        },
      ],
    },
  ],
  images: [
    {
      url: String,
      altText: String,
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);
