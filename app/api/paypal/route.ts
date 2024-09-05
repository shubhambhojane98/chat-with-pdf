import { NextRequest, NextResponse } from "next/server";
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  console.log("Search Params:", searchParams.toString()); // Log search params for debugging

  const subscription_id = searchParams.get("subscriptionId"); // Ensure the key matches the frontend

  console.log("subscriptionId:", subscription_id); // Log subscriptionId for debugging

  // const subscription_id = searchParams.get("subscriptionId");
  // console.log("subscriptionId", subscription_id);

  try {
    const token = await getAccessToken();
    const { data } = await axios.get(
      `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscription_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch subscription details" },
      { status: 500 }
    );
  }
}
