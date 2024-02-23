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

const getSupportMessages = asyncHandler(async (req, res, next) => {
  const user = req.user;
  let supportChatsPath;
  if (user.role === "admin") {
    if (!req.query.chatId) {
      return next(new ApiError("Please Provide ChatId", 400));
    }
    supportChatsPath = `SupportChat/${req.query.chatId}`;
  } else {
    supportChatsPath = `SupportChat/${user.email.split(".")[0]}`;
  }
  const supportChats = await getMessages(supportChatsPath);

  if (!supportChats) {
    return next(new ApiError("No support chats found", 404));
  }

  const messages = Object.values(supportChats);
  sendSuccessResponse(res, messages, 200);
});
// sendSupportMessage (admin,seller, customer)
const sendSupportMessage = asyncHandler(async (req, res, next) => {
  const user = req.user;

  let supportChatsPath;
  if (user.role === "admin") {
    if (!req.query.chatId) {
      return next(new ApiError("Please Provide ChatId", 400));
    }
    supportChatsPath = `SupportChat/${req.query.chatId}`;
  } else {
    supportChatsPath = `SupportChat/${user.email.split(".")[0]}`;
  }
  const newMessage = {
    message: req.body.message,

    senderType: user.role,
  };
  await addMessage(supportChatsPath, newMessage);

  sendSuccessResponse(res, { message: "Send Successfully" }, 200);
});

// getMyShopChats (seller)
const getMyShopChats = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const shopChatsPath = `ShopChat/${user.shopName}`;
  const shopChats = await getMessages(shopChatsPath);

  if (!shopChats) {
    return next(new ApiError("No Shop Chats Found ", 404));
  }
  const chatsIds = Object.keys(shopChats);

  let chats = [];

  chatsIds.map(async (chatId) => {
    const MessagesIds = Object.keys(shopChats[chatId]);
    const lastMessageId = MessagesIds[MessagesIds.length - 1];

    const lastMessage = shopChats[chatId][lastMessageId];

    const obj = { chatId, lastMessage };

    chats.unshift(obj);
  });

  sendSuccessResponse(res, chats, 200);
});
// getShopMessages (seller, customer)
const getShopMessages = asyncHandler(async (req, res, next) => {
  const user = req.user;

  let shopChatsPath;
  if (user.role === "seller") {
    if (!req.query.chatId) {
      return next(new ApiError("Please Provide ChatId", 400));
    }
    shopChatsPath = `ShopChat/${user.shopName}/${req.query.chatId}`;
  } else {
    if (!req.query.shopName) {
      return next(new ApiError("Please Provide shopName", 400));
    }
    shopChatsPath = `ShopChat/${req.query.shopName}/${
      user.email.split(".")[0]
    }`;
  }
  const shopChats = await getMessages(shopChatsPath);
  const message = Object.values(shopChats);
  sendSuccessResponse(res, message, 200);
});
// sendShopMessage (seller, customer)
const sendShopMessage = asyncHandler(async (req, res, next) => {
  const user = req.user;
  let shopChatsPath;
  if (user.role === "seller") {
    if (!req.query.chatId) {
      return next(new ApiError("Please Provide ChatId", 400));
    }
    shopChatsPath = `ShopChat/${user.shopName}/${req.query.chatId}`;
  } else {
    if (!req.query.shopName) {
      return next(new ApiError("Please Provide shopName", 400));
    }
    shopChatsPath = `ShopChat/${req.query.shopName}/${
      user.email.split(".")[0]
    }`;
  }

  const newMessage = {
    message: req.body.message,
    senderType: user.role,
  };
  await addMessage(shopChatsPath, newMessage);
  sendSuccessResponse(res, { message: "Send Successfully" }, 200);
});
module.exports = {
  getAllSupportChats,
  getSupportMessages,
  sendSupportMessage,
  getMyShopChats,
  getShopMessages,
  sendShopMessage,
};
