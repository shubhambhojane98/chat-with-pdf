import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { adminDb } from "@/firebaseAdmin";
import admin from "firebase-admin";

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

// Get subscription details
async function getSubscriptionDetails(subscriptionId: string): Promise<any> {
  const accessToken = await getAccessToken();

  const response = await axios({
    method: "get",
    url: `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

async function saveScheduledCancellation(
  userId: string,
  subscriptionId: string,
  cancelAt: Date
) {
  try {
    // Create a reference to the user's subscriptions collection
    const userSubscriptionsRef = adminDb.collection("users").doc(userId);

    // Set or update the scheduled cancellation time
    await userSubscriptionsRef.set(
      {
        cancelAt: admin.firestore.Timestamp.fromDate(cancelAt),
      },
      { merge: true }
    );

    console.log(
      `Scheduled cancellation for subscription ${subscriptionId} saved successfully.`
    );
  } catch (error) {
    console.error("Error saving scheduled cancellation:", error);
    throw new Error("Failed to save scheduled cancellation");
  }
}

// POST request handler for scheduling cancellation
export async function POST(req: NextRequest) {
  const { subscription_id, reason, userId } = await req.json();

  console.log("PDEBUG", subscription_id, userId);

  try {
    const subscriptionDetails = await getSubscriptionDetails(subscription_id);

    // Assuming `billing_info.next_billing_time` is available
    const nextBillingDate = new Date(
      subscriptionDetails.billing_info.next_billing_time
    );

    // Schedule the cancellation one day after the next billing date
    const cancelAt = new Date(nextBillingDate);
    cancelAt.setDate(cancelAt.getDate() + 1);

    // Save the cancelAt date in the database associated with the userId
    await saveScheduledCancellation(userId, subscription_id, cancelAt);

    return NextResponse.json({
      message: `Cancellation scheduled for ${cancelAt}`,
    });
  } catch (error) {
    console.error("Failed to schedule subscription cancellation:", error);
    return NextResponse.json(
      { error: "Failed to schedule subscription cancellation" },
      { status: 500 }
    );
  }
}
