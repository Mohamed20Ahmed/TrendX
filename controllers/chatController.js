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

  Object.keys(supportChats).forEach((key) => {
    const newKey = `${key}.com`;

    supportChats[newKey] = supportChats[key];

    delete supportChats[key];
  });

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

    supportChatsPath = `SupportChat/${req.query.chatId.split(".")[0]}`;
  } else {
    supportChatsPath = `SupportChat/${user.email.split(".")[0]}`;
  }

  let supportChats = await getMessages(supportChatsPath);

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

  addMessage(supportChatsPath, newMessage);

  sendSuccessResponse(res, { message: "Send Successfully" }, 200);
});

// getShopsNames (admin only)
const getShopsNames = asyncHandler(async (req, res, next) => {
  const shopChatsPath = `ShopChat/`;

  const shopChats = await getMessages(shopChatsPath);

  if (!shopChats) {
    return next(new ApiError("No Shop Chats Found ", 404));
  }

  const shopNames = Object.keys(shopChats);

  sendSuccessResponse(res, shopNames, 200);
});

// getMyShopChats (seller)
const getMyShopChats = asyncHandler(async (req, res, next) => {
  const user = req.user;
  let shopChatsPath;
  if (user.role === "seller") {
    shopChatsPath = `ShopChat/${user.shopName}`;
  } else {
    if (!req.query.shopName) {
      return next(new ApiError("Please Provide shopName", 400));
    }
    shopChatsPath = `ShopChat/${req.query.shopName}`;
  }

  const shopChats = await getMessages(shopChatsPath);

  if (!shopChats) {
    return next(new ApiError("No Shop Chats Found ", 404));
  }

  Object.keys(shopChats).forEach((key) => {
    const newKey = `${key}.com`;
    shopChats[newKey] = shopChats[key];
    delete shopChats[key];
  });
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

  const query = req.query;

  let shopChatsPath;

  if (user.role === "seller") {
    if (!query.chatId) {
      return next(new ApiError("Please Provide ChatId", 400));
    }

    shopChatsPath = `ShopChat/${user.shopName}/${query.chatId.split(".")[0]}`;
  } else if (user.role === "customer") {
    if (!query.shopName) {
      return next(new ApiError("Please Provide shopName", 400));
    }
    shopChatsPath = `ShopChat/${query.shopName}/${user.email.split(".")[0]}`;
  } else {
    if (!query.shopName || !query.customerEmail) {
      return next(
        new ApiError("Please Provide shopName and customerEmail", 400)
      );
    }
    shopChatsPath = `ShopChat/${query.shopName}/${
      query.customerEmail.split(".")[0]
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

const getMyCustomerChats = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const customerEmail = user.email.split(".")[0]; // Assuming the user's email is the customer identifier

  const shopChatsPath = `ShopChat/`;

  const allShopChats = await getMessages(shopChatsPath);

  if (!allShopChats) {
    return next(new ApiError("No Shop Chats Found", 404));
  }

  let myChats = {};

  Object.keys(allShopChats).forEach((shopName) => {
    const shopChats = allShopChats[shopName];

    Object.keys(shopChats).forEach((chatId) => {
      const chat = shopChats[chatId];

      if (chatId === customerEmail) {
        if (!myChats[shopName]) myChats[shopName] = {};

        // Retrieve last message
        const MessagesIds = Object.keys(shopChats[chatId]);

        const lastMessageId = MessagesIds[MessagesIds.length - 1];

        const lastMessage = shopChats[chatId][lastMessageId];

        myChats[shopName][chatId] = { lastMessage }; // Store the last message
      }
    });
  });

  if (Object.keys(myChats).length === 0) {
    return next(new ApiError("No Chats Found for Customer", 404));
  }

  sendSuccessResponse(res, myChats, 200);
});

module.exports = {
  getAllSupportChats,
  getSupportMessages,
  sendSupportMessage,
  getMyShopChats,
  getShopMessages,
  sendShopMessage,
  getShopsNames,
  getMyCustomerChats,
};
