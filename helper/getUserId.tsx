"use client";
import { useUser } from "@clerk/nextjs";

export default function getUserId() {
  const { user } = useUser();
  return user;
}
