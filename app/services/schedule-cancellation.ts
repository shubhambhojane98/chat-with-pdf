import { adminDb } from "@/firebaseAdmin";
import { updateMembershipStatus } from "@/helper/MembershipStatus";
import admin from "firebase-admin";
import axios from "axios";

const PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com"; // Use 'https://api-m.paypal.com' for live

const getAccessToken = async () => {
  const response = await axios.post(
    `${PAYPAL_API_BASE}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      auth: {
        username: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        password: process.env.PAYPAL_CLIENT_SECRET!,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
};

export async function cancelSubscription(
  subscriptionId: string,
  reason?: string
) {
  const accessToken = await getAccessToken();
  await axios.post(
    `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`,
    { reason: reason || "No reason provided" },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
}

export async function checkAndCancelSubscriptions() {
  const now = new Date();
  console.log("IT RUNS1");
  const subscriptionsQuery = await adminDb
    .collection("users")
    .where("cancelAt", "<=", admin.firestore.Timestamp.fromDate(now))
    .get();
  console.log("IT RUNS2", subscriptionsQuery);
  subscriptionsQuery.forEach(async (doc) => {
    const { subscriptionId, userId } = doc.data();
    console.log("ID", subscriptionId, userId);

    if (subscriptionId) {
      await cancelSubscription(subscriptionId);

      // Update membership status and remove scheduled cancellation time
      await doc.ref.update({
        hasActiveMembership: false,
        cancelAt: admin.firestore.FieldValue.delete(), // Remove the cancelAt field
        // subscriptionId: admin.firestore.FieldValue.delete(), // Optionally remove subscriptionId if it's no longer needed
      });
    } else {
      console.log(`No subscriptionId found for user ${userId}`);
    }
    // Update membership status and delete scheduled cancellation
    // await updateMembershipStatus(userId, false, subscriptionId);
  });
}
