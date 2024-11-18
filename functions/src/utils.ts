import * as admin from "firebase-admin";

export const getUserData = async (uid: string) => {
  const userDoc = await admin.firestore().collection("users").doc(uid).get();
  if (!userDoc.exists) {
    throw new Error("User not found");
  }
  return userDoc.data();
};
