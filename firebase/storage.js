const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  // measurementId: process.env.MEASUEREMENT_ID,
};

initializeApp(firebaseConfig);

const storage = getStorage();

const addFileStorage = async (data) => {
  const { fileName, buffer, mimetype, folderName } = data;

  const storageRef = ref(storage, `${folderName}/${fileName}`);

  const metadata = {
    contentType: mimetype,
  };

  const snapshot = await uploadBytesResumable(storageRef, buffer, metadata);

  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};

module.exports = { addFileStorage };
