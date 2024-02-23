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

  chatsIds.map(async (supportId) => {
    const MessagesIds = Object.keys(supportChats[supportId]);
    const lastMessageId = MessagesIds[MessagesIds.length - 1];

    const lastMessage = supportChats[supportId][lastMessageId];

    const obj = { supportId, lastMessage };

    chats.unshift(obj);
  });

  sendSuccessResponse(res, chats, 200);
});
// getSupportMessages (admin, seller, customer)
const getSupportMessages = asyncHandler(async (req, res, next) => {
  if (!req.params.supportId) {
    return next(new ApiError("No support chat found", 404));
  }

  const supportChatsPath = "SupportChat" + "/" + req.params.supportId;
  console.log("supportChatsPath", supportChatsPath);

  const supportChats = await getMessages(supportChatsPath);

  if (!supportChats) {
    return next(new ApiError("No support chats found", 404));
  }

  const messages = Object.values(supportChats);
  console.log(req.user);
  const filteredMessages = messages.filter(
    (message) =>
      message.senderType === req.user.role || req.user.role === "admin"
  );

  sendSuccessResponse(res, filteredMessages, 200);
});
// sendSupportMessage (admin,seller, customer)
const sendSupportMessage = asyncHandler(async (req, res, next) => {
  const user = req.user;

  console.log(user);
  let supportChatsPath = "SupportChat" + "/" + req.user.email.split(".")[0];
  if (user.role === "admin") {
    supportChatsPath = "SupportChat" + "/" + req.query.supportId;
  }
  if (!req.body.message) {
    return next(new ApiError("Please Provide Message", 400));
  }
  const newMessage = {
    message: req.body.message,
    senderName: user.name,
    senderType: user.role,
  };
  await addMessage(supportChatsPath, newMessage);

  sendSuccessResponse(res, { message: "el miksiki admin" }, 200);
});

// getMyShopChats (seller)
const getMyShopChats = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const shopChatsPath = "ShopChat" + "/" + user.shopName;
  const shopChats = await getMessages(shopChatsPath);

  if (!shopChats) {
    return next(new ApiError("No Shop Chats Found ", 404));
  }
  const chatsIds = Object.keys(shopChats);

  let chats = [];

  chatsIds.map(async (shopId) => {
    const MessagesIds = Object.keys(shopChats[shopId]);
    const lastMessageId = MessagesIds[MessagesIds.length - 1];

    const lastMessage = shopChats[shopId][lastMessageId];

    const obj = { shopId, lastMessage };

    chats.unshift(obj);
  });

  sendSuccessResponse(res, chats, 200);
});
// getShopMessages (seller, customer)
const getShopMessages = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (user.role === "seller") {
    return next(new ApiError("Unauthorized access", 401));
  }
  const shopChatsPath =
    "ShopChat" + "/" + user.shopName + "/" + req.params.shopId;
  const shopChats = await getMessages(shopChatsPath);
  if (!shopChats) {
    return next(new ApiError("No Shop Chats Found ", 404));
  }

  const messages = Object.values(shopChats);
  console.log(req.user);
  const filteredMessages = messages.filter(
    (message) => message.senderType === req.user.role
  );

  sendSuccessResponse(res, filteredMessages, 200);
});
// sendShopMessage (seller, customer)
const sendShopMessage = asyncHandler(async (req, res, next) => {
  const user = req.user;
  console.log(user);
  const shopChatsPath =
    "ShopChat" + "/" + user.shopName + "/" + req.user.email.split(".")[0];
  if (!req.body.message) {
    return next(new ApiError("Please Provide Message", 400));
  }
  const newMessage = {
    message: req.body.message,
    senderName: user.name,
    senderType: user.role,
  };
  await addMessage(shopChatsPath, newMessage);
  sendSuccessResponse(res, { message: "el miksiki seller" }, 200);
});
module.exports = {
  getAllSupportChats,
  getSupportMessages,
  sendSupportMessage,
  getMyShopChats,
  getShopMessages,
  sendShopMessage,
};
