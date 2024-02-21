const cartModel = require("../models/cartModel");

const getCartByIdDB = async (id, excludedFields = "") => {
  return await cartModel.findById(id).select(excludedFields);
};
const deleteCartByIdDB = async (id) => {
  return await cartModel.findByIdAndDelete(id);
};
module.exports = { getCartByIdDB, deleteCartByIdDB };
