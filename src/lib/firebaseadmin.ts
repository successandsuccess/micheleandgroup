import * as admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { displayName } from "react-quill";
import Talk from "talkjs";
import { clientAuth } from "./firebaseclient";
if (!admin.apps.length)
  admin.initializeApp({
    credential: admin.credential.cert({
      // clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      // privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
      // projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
    }),
  });

export const isUserExist = async (
  email: string,
  password: string,
  airtable_id: string,
  type?: string,
  name?: string
) => {
  try {
    await admin.auth().getUserByEmail(email);
    await updateUser(email, email, password);
  } catch (error) {
    try {
      console.log(1);
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        emailVerified: true,
        disabled: false,
        displayName: name,
      });
      console.log(2);
      console.log(email);
      console.log(userRecord.uid);
      console.log(airtable_id);
      console.log(name);
      await admin
        .firestore()
        .collection("users")
        .doc(userRecord.uid)
        .set({ email, uid: userRecord.uid, airtable_id, type, name });
      console.log(3);
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  return true;
};

export const updateUser = async (
  previousEmail: string,
  email: string,
  password: string
) => {
    try {
      await signInWithEmailAndPassword(clientAuth, email, password);
    } catch (error) {
      const userRecord = await admin.auth().getUserByEmail(previousEmail);
      console.log(userRecord.uid);
      console.log(previousEmail);
      console.log(email);
      let object: any = {
        email: previousEmail === email ? previousEmail : email,
        emailVerified: true,
      };
      if (password) object["password"] = password;
      await admin.auth().updateUser(userRecord.uid, object);
      await admin
        .firestore()
        .collection("users")
        .doc(userRecord.uid)
        .update({ email: previousEmail === email ? previousEmail : email });
    }
  return true;
};
