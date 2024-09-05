"use client";
import { useUser } from "@clerk/nextjs";

function useUserId() {
  const { user } = useUser();
  const userId: any = user?.id;
  return { userId };
}

export default useUserId;
