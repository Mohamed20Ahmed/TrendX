const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://trendx-222b9-default-rtdb.europe-west1.firebasedatabase.app/",
});

const realtime = admin.database();
module.exports = { realtime };
