const sendSuccessResponse = (res, resData, statusCode = 200) => {
  res.status(statusCode).json({ status: "success", data: resData });
};

const sendErrorResponse = (res, err) => {
  res.status(err.statusCode).json({ status: err.status, message: err.message });
};

module.exports = { sendSuccessResponse, sendErrorResponse };
