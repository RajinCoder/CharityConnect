import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import UserProfileClient from "./UserProfileClient";

export default async function UserProfile() {
  const user = await getCurrentUser(); // might move out of the component so that when a user clicks someone else's profile it doesn't get theirs
  return <UserProfileClient user={user} />;
}
