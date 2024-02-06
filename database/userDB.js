const userModel = require("../models/userModel");
const ApiFeatures = require("../utils/apiFeatures");

const getUserByIdDB = async (id, excludedFields = "") => {
  return await userModel.findById(id).select(excludedFields);
};

const getUserDB = async (field, excludedFields = "") => {
  return await userModel.findOne(field).select(excludedFields);
};

const getCountOfDocument = async (field) => {
  return await userModel.find(field).countDocuments();
};

const getUsersByRoleDB = async (role, req) => {
  // get count of users to use it in pagination results
  const documentsCounts = await getCountOfDocument({ role });

  // apply api features
  const apiFeatures = new ApiFeatures(userModel.find({ role }), req.query)
    .paginate(documentsCounts)
    .filter()
    .search("users")
    .limitFields()
    .sort();

  // result from api features
  const { mongooseQuery, paginationResult } = apiFeatures;

  const users = await mongooseQuery;

  return { paginationResult, users };
};

// const getCustomersDB = async (req) => {
//   // get count of customers to use it in pagination results
//   const documentsCounts = await getCountOfDocument({ role: "customer" });

//   // apply api features
//   const apiFeatures = new ApiFeatures(
//     userModel.find({ role: "customer" }),
//     req.query
//   )
//     .paginate(documentsCounts)
//     .filter()
//     .search("users")
//     .limitFields()
//     .sort();

//   // result from api features
//   const { mongooseQuery, paginationResult } = apiFeatures;

//   const customers = await mongooseQuery;

//   return { paginationResult, customers };
// };

// const getSellersDB = async (req) => {
//   // get count of sellers to use it in pagination results
//   const documentsCounts = await getCountOfDocument({ role: "seller" });

//   // apply api features
//   const apiFeatures = new ApiFeatures(
//     userModel.find({ role: "seller" }),
//     req.query
//   )
//     .paginate(documentsCounts)
//     .filter()
//     .search("users")
//     .limitFields()
//     .sort();

//   // result from api features
//   const { mongooseQuery, paginationResult } = apiFeatures;

//   const sellers = await mongooseQuery;

//   return { paginationResult, sellers };
// };

const createUserDB = async (data) => {
  return await userModel.create(data);
};

const updateUserDB = async (field, data) => {
  return await userModel.findOneAndUpdate(field, data);
};

const deleteUserDB = async (field) => {
  return await userModel.findOneAndDelete(field);
};

module.exports = {
  getUserByIdDB,
  getUserDB,
  getUsersByRoleDB,
  createUserDB,
  updateUserDB,
  deleteUserDB,
};
