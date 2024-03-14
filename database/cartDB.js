const cartModel = require("../models/cartModel");
const ApiFeatures = require("../utils/apiFeatures");

const getCartDB = async (field, excludedFields = "") => {
  return await cartModel.findOne(field).select(excludedFields);
};

const getCartByIdDB = async (id, excludedFields = "") => {
  return await cartModel.findById(id).select(excludedFields);
};

const getAllCartDB = async ( req) => {
  // get count of products to use it in pagination results
  const documentsCounts = await getCountOfDocument();

  // apply api features
  const apiFeatures = new ApiFeatures(cartModel.find(), req.query)
    .paginate(documentsCounts)
    .sort();

    let { mongooseQuery, paginationResult } = apiFeatures;
    const cart = await mongooseQuery;

  return { paginationResult, cart };
};

const addToCartDB = async (data) => {
  return await cartModel.create(data);
};

const updateCartDB = async (field,...opt) => {
  return await cartModel.findOneAndUpdate(field,...opt);
  
};

const deleteCartByIdDB = async (id) => {
  return await cartModel.findByIdAndDelete(id);
};

module.exports = {getCartDB,
   getCartByIdDB,
   getAllCartDB,
   addToCartDB,
   updateCartDB,
    deleteCartByIdDB };
