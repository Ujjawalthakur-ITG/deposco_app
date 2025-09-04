// shopifyProducts.js
require("dotenv").config();
const axios = require("axios");

const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// GraphQL query function
const fetchProductsPage = async (afterCursor = null) => {
  const query = `
    query GetProductsWithVariants($after: String) {
      products(first: 250, after: $after) {
        edges {
          node {
            id
            title
            handle
            productType
            vendor
            createdAt
            updatedAt
            publishedAt
            status
            tags
            options {
              id
              name
              values
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  sku
                  price
                  compareAtPrice
                  inventoryQuantity
                  availableForSale
                  barcode
                  image {
                    url
                    altText
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            media(first: 10) {
              edges {
                node {
                  preview {
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const response = await axios.post(
    `https://${SHOPIFY_STORE_URL}/admin/api/2024-07/graphql.json`,
    { query, variables: { after: afterCursor } },
    {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    }
  );

  // return only products object
  const data = await JSON.stringify(response.data.data.products,null , 2)
  return data ;
};

module.exports = { fetchProductsPage };
