const OpenAI = require("openai");
const asyncHandler = require("express-async-handler");

const { sendSuccessResponse } = require("../utils/responseHandler");

const openai = new OpenAI({
  apiKey: "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",
});

const chatgpt = asyncHandler(async (req, res, next) => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: req.body.message }],
    model: "gpt-3.5-turbo",
    max_tokens: 100,
  });

  const response = { message: completion.choices[0].message.content };

  sendSuccessResponse(res, response, 200);
});

module.exports = { chatgpt };
