const { realtime } = require("./firebaseConfig");

const addMessage = (chatPath, content) => {
  const ref = realtime.ref(chatPath);
  ref.push().set({ ...content });
};

const getMessages = async (chatPath, limit = 0) => {
  const ref = realtime.ref(chatPath);

  let snapshot;
  if (limit) {
    snapshot = await ref.limitToLast(limit).orderByValue().once("value");
  } else {
    snapshot = await ref.orderByValue().once("value");
  }

  if (snapshot.exists()) {
    return snapshot.val();
  }
};

module.exports = {
  addMessage,
  getMessages,
};
