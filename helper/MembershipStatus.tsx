"use server";
import { db } from "@/firebase";
import { adminDb } from "@/firebaseAdmin";
import {
  doc,
  setDoc,
  updateDoc,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";

export async function updateMembershipStatus(
  userId?: string | undefined,
  status?: boolean,
  subscriptionId?: string,
  test?: string
): Promise<void> {
  if (!userId) {
    throw new Error("User ID is undefined.");
  }
  // const userDocRef: DocumentReference<DocumentData> = doc(db, "users", userId);

  console.log("DEBUG2", userId, subscriptionId);
  try {
    await adminDb
      .collection("users")
      .doc(userId)
      .set({
        subscriptionId: subscriptionId || null,
        userId: userId,
      });
    await adminDb.collection("users").doc(userId).update({
      hasActiveMembership: status,
    });
    // await setDoc(userDocRef, { subscriptionId }, { merge: true });
    // await updateDoc(userDocRef, {
    //   hasActiveMembership: status,
    // });
  } catch (error) {
    console.error("Error updating membership status:", error);
  }
}
