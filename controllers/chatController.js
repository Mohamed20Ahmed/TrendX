// const asyncHandler = require("express-async-handler");

// const ApiError = require("../utils/apiError");
// const axios = require("axios");
// const CHAT_ENGINE_PROJECT_ID = "2ecf720d-d720-4359-b1e2-4c9c7450249a";
// const CHAT_ENGINE_PRIVATE_KEY = "1a4277f5-2277-4fb2-9b1a-45e3e147b546";
// const chatSignUp = asyncHandler(async (req, res, next) => {
//   const request = await axios.post(
//     "https://api.chatengine.io/users/",
//     { username, secret, email, first_name, last_name },
//     { headers: { "Private-Key": CHAT_ENGINE_PRIVATE_KEY } }
//   );
//   if (!request) {
//     return next(new ApiError(`There is Error`, 404));
//   }

//   sendSuccessResponse(res, response, 201);
// });
