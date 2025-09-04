const {fetchProductsPage} = require("./shopifyProducts")
const Product = require("../models/Product");
// Sync function: fetch all products page by page
const syncProductsToMongo = async () => {
  let hasNextPage = true;
  let endCursor = null;
  let totalSaved = 0;
console.log(totalSaved,"total saved")
  while (hasNextPage) {
    const productsData = (await fetchProductsPage(endCursor));
    console.log(productsData.length,"productsData")
const productEdges = productsData?.data?.products?.edges || [];
console.dir(productsData, { depth: null });

    console.log(productEdges,"product")
  for (const edge of productEdges) {
  const p = edge.node;

  const newProduct = {
    productId: p.id,
    title: p.title,
    handle: p.handle,
    vendor: p.vendor,
    productType: p.productType,
    status: p.status,
    tags: p.tags,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    publishedAt: p.publishedAt,
    options: p.options.map((o) => ({
      name: o.name,
      values: o.values,
    })),
    variants: p.variants.edges.map((v) => ({
      variantId: v.node.id,
      title: v.node.title,
      sku: v.node.sku,
      price: v.node.price,
      compareAtPrice: v.node.compareAtPrice,
      inventoryQuantity: v.node.inventoryQuantity,
      availableForSale: v.node.availableForSale,
      barcode: v.node.barcode,
      image: v.node.image,
      selectedOptions: v.node.selectedOptions,
    })),
    images: p.media.edges.map((m) => ({
      url: m.node.preview?.image?.url,
      altText: m.node.preview?.image?.altText,
    })),
  };

  await Product.findOneAndUpdate(
    { productId: newProduct.productId },
    newProduct,
    { upsert: true, new: true }
  );

  totalSaved++;
}


   const pageInfo = productsData?.data?.products?.pageInfo;
   hasNextPage = pageInfo?.hasNextPage || false;
   endCursor = pageInfo?.endCursor || null;
    console.log(
      `Saved ${totalSaved} products so far... (hasNextPage: ${hasNextPage})`
    );
  }

  console.log("✅ All products synced to MongoDB");
};
module.exports = { syncProductsToMongo };