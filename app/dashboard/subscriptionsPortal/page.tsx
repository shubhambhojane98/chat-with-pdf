"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase";
import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import Alert from "@/components/Alert";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";

interface Subscriber {
  email_address: string;
  name: {
    given_name: string;
    surname: string;
  };
}

interface Billing {
  next_billing_time: string;
}

interface SubscriptionDetails {
  id: string;
  status: string;
  plan_id: string;
  start_time: string;
  subscriber: Subscriber;
  billing_info: Billing;
}

export const dynamic = "force-dynamic";

const subscriptionPortal = () => {
  const [subscriptionDetails, setSubscriptionDetails] =
    useState<SubscriptionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [cancelDate, setCancelDate] = useState<string | null>(null);
  const { hasActiveMembership } = useSubscription();

  // const userDoc =  db.collection('users').doc(userId).get();
  // const subscription_id = userDoc.data()?.subscription_id;
  const { user } = useUser();

  const router = useRouter();

  // Reference the document
  const docRef = doc(db, "users", user?.id!);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       if (!user?.id) return; // Ensure the user ID is available

  //       // Create a reference to the document
  //       const docRef = doc(db, "users", user.id);

  //       // Retrieve the document
  //       const docSnapshot = await getDoc(docRef);

  //       if (docSnapshot.exists()) {
  //         // Document data is available
  //         // setUserData(docSnapshot.data());
  //         console.log(
  //           "Document data:",
  //           docSnapshot?.data()?.cancelAt?.toDate()
  //         );
  //         const date = new Date(docSnapshot?.data()?.cancelAt?.toDate());

  //         const formattedDate = date?.toLocaleDateString("en-GB");

  //         console.log(formattedDate);
  //         setCancelDate(formattedDate);
  //       } else {
  //         console.log("No such document!");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching document:", error);
  //     }
  //   };

  //   fetchUserData();
  // }, [user?.id]);

  console.log("C", subscriptionDetails?.billing_info?.next_billing_time);

  const fetchSubscriptionData = async () => {
    try {
      const docRef = doc(db, "users", user?.id!); // Replace with your collection and doc ID
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const subscription_id = docSnapshot.data().subscriptionId;
        const cancelAtTimestamp = docSnapshot?.data()?.cancelAt;

        if (cancelAtTimestamp) {
          // Convert Firestore Timestamp to a JavaScript Date
          const cancelAtDate = cancelAtTimestamp.toDate();

          // Format the date to "dd/mm/yyyy" format
          const formattedDate = cancelAtDate.toLocaleDateString("en-GB"); // "en-GB" gives you "dd/mm/yyyy"
          console.log("Cancel Date : ", formattedDate);
          setCancelDate(formattedDate);
        } else {
          setCancelDate(null); // Handle case where cancelAt doesn't exist
        }
        setSubscriptionId(subscription_id);
        console.log("Subscription ID:", subscription_id); // This should now log correctly
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  useEffect(() => {
    console.log("UseEffect Runs ..........");
    // Fetch the subscription ID and cancelAt from Firebase
    fetchSubscriptionData();
  }, [hasActiveMembership]);

  useEffect(() => {
    if (!subscriptionId) return;

    // Fetch subscription details once the subscriptionId is available
    const fetchSubscriptionDetails = async () => {
      try {
        const response = await axios.get<SubscriptionDetails>("/api/paypal", {
          params: { subscriptionId },
        });
        setLoading(false);
        setSubscriptionDetails(response.data);
        setError(null);
        setSuccess("Subscription details fetched successfully");
      } catch (err) {
        setError("Failed to fetch subscription details");
        setSubscriptionDetails(null);
        setSuccess(null);
      }
    };

    fetchSubscriptionDetails();
  }, [subscriptionId, hasActiveMembership]); // This effect will run when subscriptionId changes

  const cancelSubscription = async () => {
    setShowAlert(false);

    if (!subscriptionDetails) return;

    try {
      await axios.post(`/api/paypal/subscription/cancel`, {
        subscription_id: subscriptionDetails.id,
        userId: user?.id,
        reason: "User requested cancellation",
      });
      setSuccess("Subscription cancelled successfully");
      setError(null);
      // setSubscriptionDetails(null);
      fetchSubscriptionData();
      router.refresh();
    } catch (err) {
      setError("Failed to cancel subscription");
      setSuccess(null);
    }
    console.log("User confirmed the cancellation.");
  };

  const handleCancelClick = () => {
    setShowAlert(true);
  };

  const handleCancel = () => {
    setShowAlert(false);
    console.log("User decided not to cancel.");
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-60">
        <Loader2Icon size="50" className="animate-spin text-indigo-600" />;
      </div>
    );
  }

  console.log("s", subscriptionDetails);
  console.log(error, success);

  return (
    <div className="max-w-3xl mx-auto mt-48  flex flex-col  items-center text-center">
      <h1 className="text-2xl text-indigo-600 mb-4">
        Manage Your Subscription
      </h1>
      {/* {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>} */}
      {subscriptionDetails && (
        <div className="max-w-2xl shadow-md p-10">
          <h2 className="font-semibold">Subscription Details</h2>
          <div className="flex flex-col justify-evenly py-5">
            <div className="flex mb-4">
              <strong>ID:</strong>
              <p className="mx-2">{subscriptionDetails?.id}</p>
            </div>
            <div className="flex mb-4">
              <strong>Name:</strong>
              <p className="mx-2">
                {subscriptionDetails.subscriber?.name.given_name +
                  " " +
                  subscriptionDetails.subscriber?.name.surname}
              </p>
            </div>
            <div className="flex mb-4">
              <strong>Email Id:</strong>
              <p className="mx-2">
                {subscriptionDetails.subscriber?.email_address}
              </p>
            </div>
            <div className="flex mb-4">
              <strong>Start Date:</strong>
              <p className="mx-2">
                {" "}
                {new Date(subscriptionDetails?.start_time).toLocaleDateString()}
              </p>
            </div>
            {cancelDate && (
              <div className="flex mb-4">
                <strong>End Date:</strong>
                <p className="mx-2"> {cancelDate}</p>
              </div>
            )}
            <div className="flex mb-4">
              <strong>Status:</strong>
              <p className="inline-block rounded-full bg-green-100 text-green-800 px-3 mx-2  py-1 text-sm font-semibold">
                {subscriptionDetails?.status.toLocaleLowerCase()}
              </p>
            </div>
          </div>
          {
            <Button
              onClick={handleCancelClick}
              disabled={
                subscriptionDetails?.status.toLocaleLowerCase() ===
                  "cancelled" || cancelDate !== null
              }
              style={{ background: "red" }}
            >
              Cancel Subscription
            </Button>
          }
          <Alert
            cancelDate={subscriptionDetails?.billing_info?.next_billing_time}
            onConfirm={cancelSubscription}
            open={showAlert}
            setOpen={setShowAlert}
          />
        </div>
      )}
      {/* {showAlert && (
        <Alert onConfirm={cancelSubscription} onCancel={handleCancel} />
      )} */}
    </div>
  );
};

export default subscriptionPortal;
