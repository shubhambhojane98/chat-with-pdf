"use client";
import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { updateMembershipStatus } from "@/helper/MembershipStatus";
import { useToast } from "./ui/use-toast";

interface PayPalButtonProps {
  userId: string | null | undefined;
}

const PayPalButton = ({ userId }: PayPalButtonProps) => {
  const PlanID = "P-1YV76936S6250183FM3FOV3Y";
  const { toast } = useToast();
  console.log(".....e");
  return (
    <PayPalButtons
      createSubscription={(data, actions) => {
        return actions.subscription.create({
          plan_id: PlanID, // Replace with your PayPal Plan ID
          custom_id: userId!,
        });
      }}
      onApprove={async (data, actions) => {
        // toast.success('Payment successful! Please wait a minute for activation.');
        // The subscription was approved, so update Firebase
        updateMembershipStatus(userId!, true);
        toast({
          variant: "default",
          title: "Success",
          description:
            "Payment successful! Please wait a minute for activation.",
          duration: 7000,
        });
      }}
      onCancel={() => {
        console.log("Subscription canceled");
      }}
      onError={(err) => {
        console.error("PayPal error", err);
      }}
    />
  );
};

export default PayPalButton;
