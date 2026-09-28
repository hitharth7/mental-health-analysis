// src/lib/firebaseAdmin.ts
import * as admin from "firebase-admin";

let adminApp: admin.app.App | null = null;

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const isValidKey =
  Boolean(privateKey) &&
  !privateKey?.includes("YOUR_PRIVATE_KEY_HERE") &&
  Boolean(privateKey?.includes("BEGIN PRIVATE KEY"));

if (!admin.apps.length && isValidKey) {
  try {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  } catch (err) {
    console.error("Firebase Admin initialization error:", err);
  }
} else if (admin.apps.length > 0) {
  adminApp = admin.apps[0];
}

export const adminDB = (adminApp
  ? adminApp.firestore()
  : new Proxy({}, {
      get() {
        return () => {
          throw new Error("Firebase Admin is not initialized. Check FIREBASE_PRIVATE_KEY in .env.local");
        };
      },
    })) as unknown as admin.firestore.Firestore;

export const adminAuth = (adminApp
  ? adminApp.auth()
  : new Proxy({}, {
      get() {
        return () => {
          throw new Error("Firebase Admin is not initialized. Check FIREBASE_PRIVATE_KEY in .env.local");
        };
      },
    })) as unknown as admin.auth.Auth;

