const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://trendx-4fd19-default-rtdb.firebaseio.com/",
});

const realtime = admin.database();

module.exports = { realtime };
