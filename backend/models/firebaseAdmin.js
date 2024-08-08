import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" }; // Update the path to your service account key file

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://first-try-a4dff.firebaseio.com" // Replace with your database URL
  });
}

export const db = admin.firestore();
