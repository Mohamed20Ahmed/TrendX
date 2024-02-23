const asyncHandler = require("express-async-handler");

const { addMessage, getMessages } = require("../firebase/realtime");
const ApiError = require("../utils/apiError");
const { sendSuccessResponse } = require("../utils/responseHandler");

// getAllSupportChats (admin)
const getAllSupportChats = asyncHandler(async (req, res, next) => {
  const supportChatsPath = "SupportChat";

  const supportChats = await getMessages(supportChatsPath);

  if (!supportChats) {
    return next(new ApiError("No support chats found", 404));
  }

  const chatsIds = Object.keys(supportChats);

  let chats = [];

  chatsIds.map(async (chatId) => {
    const MessagesIds = Object.keys(supportChats[chatId]);
    const lastMessageId = MessagesIds[MessagesIds.length - 1];

    const lastMessage = supportChats[chatId][lastMessageId];

    const obj = { chatId, lastMessage };

    chats.unshift(obj);
  });

  sendSuccessResponse(res, chats, 200);
});

// getSupportMessages (admin, seller, customer)

// sendSupportMessage (admin,seller, customer)

// getMyShopChats (seller)
// getShopMessages (seller, customer)
// sendShopMessage (seller, customer)
module.exports = {
  getAllSupportChats,
};
