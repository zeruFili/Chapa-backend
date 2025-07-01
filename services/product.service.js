const { productModel } = require("../models"); // Use destructuring to import productModel

const createProduct = async (data) => {
  const { name, description, price, image, category, amount } = data;

  const product = new productModel({ // Use productModel here
    name,
    description,
    price,
    image,
    category,
    amount,
  });

  await product.save();
  return product;
};

const getAllProducts = async () => {
  return await productModel.find({}); // Use productModel here
};

const getFeaturedProducts = async () => {
  return await productModel.find({ isFeatured: true }).lean(); // Use productModel here
};

const getProductById = async (id) => {
  return await productModel.findById(id); // Use productModel here
};

const updateProduct = async (id, updates) => {
  return await productModel.findByIdAndUpdate(id, updates, { new: true }); // Use productModel here
};

const deleteProduct = async (id) => {
  return await productModel.findByIdAndDelete(id); // Use productModel here
};

const getRecommendedProducts = async () => {
  return await productModel.aggregate([ // Use productModel here
    { $sample: { size: 4 } },
    { $project: { _id: 1, name: 1, description: 1, image: 1, price: 1 } },
  ]);
};

const getProductsByCategory = async (category) => {
  return await productModel.find({ category }); // Use productModel here
};

const toggleFeaturedStatus = async (id) => {
  const product = await getProductById(id);
  if (!product) throw new Error("Product not found");

  product.isFeatured = !product.isFeatured;
  return await product.save();
};

const increaseProductAmount = async (id) => {
  const product = await getProductById(id);
  if (!product) throw new Error("Product not found");

  product.amount += 1;
  await product.save();
  return product;
};

const decreaseProductAmount = async (id) => {
  const product = await getProductById(id);
  if (!product) throw new Error("Product not found");

  if (product.amount > 0) {
    product.amount -= 1;
    await product.save();
    return product;
  } else {
    throw new Error("Amount cannot be less than zero");
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getRecommendedProducts,
  getProductsByCategory,
  toggleFeaturedStatus,
  increaseProductAmount,
  decreaseProductAmount,
};