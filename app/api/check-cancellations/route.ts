import { checkAndCancelSubscriptions } from "@/app/services/schedule-cancellation";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     console.log("IT RUNS");
//     await checkAndCancelSubscriptions();
//     res.status(200).json({ message: "Checked and processed cancellations" });
//   } catch (error) {
//     console.error("Failed to check and cancel subscriptions:", error);
//     res.status(500).json({ error: "Failed to check and cancel subscriptions" });
//   }
// }

export async function POST(req: NextRequest) {
  console.log("check-cancellations endpoint hit");

  try {
    await checkAndCancelSubscriptions();
    return NextResponse.json({ message: "Checked and canceled subscriptions" });
  } catch (error) {
    console.error("Error in check-cancellations:", error);
    return NextResponse.json(
      { error: "Failed to check cancellations" },
      { status: 500 }
    );
  }
}
