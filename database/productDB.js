const productModel = require("../models/productModel");

const getProductByIdDB = async (id, excludedFields = "") => {
  return await productModel.findById(id).select(excludedFields);
};

const productBulkWriteDB = async (operations, options = {}) => {
  return await productModel.bulkWrite(operations, options);
};

module.exports = {
  getProductByIdDB,
  productBulkWriteDB,
};
