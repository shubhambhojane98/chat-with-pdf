import { NextRequest, NextResponse } from "next/server";
import crypto, { setEngine } from "crypto";
import { updateMembershipStatus } from "@/helper/MembershipStatus";
import { getAuth } from "firebase/auth";
import { auth, currentUser } from "@clerk/nextjs/server";
import { adminDb } from "@/firebaseAdmin";
import { getSession } from "next-auth/react";
import { NextApiRequest } from "next";

// const auth = getAuth();

async function getScheduledCancellation(
  userId: string,
  subscriptionId: string
): Promise<Date | null> {
  try {
    const userSubscriptionsRef = adminDb.collection("users").doc(userId);

    const docSnapshot = await userSubscriptionsRef.get();

    if (docSnapshot.exists) {
      const data = docSnapshot.data();
      if (data && data.cancelAt) {
        return data.cancelAt.toDate(); // Convert Firestore Timestamp to Date
      }
    }

    return null;
  } catch (error) {
    console.error("Error retrieving scheduled cancellation:", error);
    return null;
  }
}

export async function POST(req: any) {
  // const userId: string = auth.currentUser?.uid!;
  console.log("Webhook received"); // First log statement

  try {
    // Extract headers and body
    // const paypalTransmissionId =
    //   req.headers.get("paypal-transmission-id") || "";
    // const paypalTransmissionTime =
    //   req.headers.get("paypal-transmission-time") || "";
    // const paypalTransmissionSig =
    //   req.headers.get("paypal-transmission-sig") || "";
    // const paypalCertUrl = req.headers.get("paypal-cert-url") || "";
    // const paypalAuthAlgo = req.headers.get("paypal-auth-algo") || "";
    // const webhookId = process.env.PAYPAL_WEBHOOK_ID || "";

    // const body = await req.text(); // Get the raw body text for hashing
    // const bodyJson = JSON.parse(body); // Parse the JSON body

    // Get the raw body text for hashing
    const rawBody = await req.text();
    const bodyJson = JSON.parse(rawBody); // Parse the JSON body
    // // Create a hash of the payload using the native crypto module
    // const payloadHash = crypto
    //   .createHash("sha256")
    //   .update(rawBody)
    //   .digest("hex");

    // Construct the expected signature
    // const expectedSignature = crypto
    //   .createHmac("sha256", process.env.PAYPAL_CLIENT_SECRET!)
    //   .update(
    //     `${paypalTransmissionId}|${paypalTransmissionTime}|${webhookId}|${paypalAuthAlgo}|${rawBody}`
    //   )
    //   .digest("base64");

    // Verify the signature
    // if (expectedSignature !== paypalTransmissionSig) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    // }

    // Extract relevant data from the event
    const userId = bodyJson.resource.custom_id;
    const subscriptionId = bodyJson.resource.id;
    const eventType = bodyJson.event_type;

    // Handle the webhook event (parse the JSON body)
    const event = JSON.parse(rawBody);

    console.log("DEBUG1", userId, subscriptionId);
    console.log("DEBUG3", bodyJson);

    // Implement your logic for different webhook events here
    // Toggle hasActiveMembership based on the event type
    switch (eventType) {
      case "BILLING.SUBSCRIPTION.CREATED":
        // Subscription created
        // await updateMembershipStatus(userId, true, subscriptionId);
        break;

      case "PAYMENT.SALE.COMPLETED":
      case "BILLING.SUBSCRIPTION.ACTIVATED":
        // Subscription payment successful or subscription activated
        await updateMembershipStatus(userId, true, subscriptionId);

        break;

      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.EXPIRED":
        // Subscription cancelled or expired
        // await updateMembershipStatus(userId, false, subscriptionId);
        // Subscription cancelled or expired
        await updateMembershipStatus(userId, false, subscriptionId);
        console.log(
          `Subscription ${subscriptionId} for user ${userId} has been cancelled.`
        );

        break;

      case "BILLING.SUBSCRIPTION.SUSPENDED":
        // Subscription suspended
        await updateMembershipStatus(userId, false, subscriptionId);
        break;

      case "BILLING.SUBSCRIPTION.DELETED":
        // Subscription deleted
        await updateMembershipStatus(userId, false, subscriptionId);
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
        break;
    }
    return NextResponse.json({ message: `Webhook received : ${eventType}` });
  } catch (error) {
    console.error("Error handling PayPal webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
