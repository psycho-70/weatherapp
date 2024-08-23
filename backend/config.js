import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" }; // Add assert { type: "json" }
import {  FieldValue } from 'firebase-admin/firestore';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://first-try-a4dff.firebaseio.com" // Replace with your database URL
  });
}

const db = admin.firestore();
export { db, FieldValue };