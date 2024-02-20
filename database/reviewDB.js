const reviewModel = require("../models/reviewModel");
const ApiFeatures = require("../utils/apiFeatures");

const getReviewByIdDB = async (id, excludedFields = "") => {
  return await reviewModel.findById(id).select(excludedFields);
};

const getReviewDB = async (field, excludedFields = "") => {
  return await reviewModel.findOne(field).select(excludedFields);
};

const getCountOfDocument = async (field) => {
  return await reviewModel.find(field).countDocuments();
};

const getReviewsDB = async (role, req) => {
  // get count of users to use it in pagination results
  const documentsCounts = await getCountOfDocument();

  // apply api features
  const apiFeatures = new ApiFeatures(userModel.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .limitFields()
    .sort();

  // result from api features
  const { mongooseQuery, paginationResult } = apiFeatures;

  const users = await mongooseQuery;

  return { paginationResult, users };
};

const createReviewDB = async (data) => {
  return await reviewModel.create(data);
};

const updateReviewDB = async (field, data) => {
  return await reviewModel.findOneAndUpdate(field, data);
};

const deleteReviewDB = async (field) => {
  return await reviewModel.findOneAndDelete(field);
};

module.exports = {
  getReviewByIdDB,
  getReviewDB,
  getReviewsDB,
  createReviewDB,
  updateReviewDB,
  deleteReviewDB,
};
