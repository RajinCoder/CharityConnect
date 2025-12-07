import UserProfile from "@/app/components/UserProfile";
import { getCurrentUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  console.log("Current user:", user);
  return (
    <div className="m-auto">
      <UserProfile isOwner={true} user={user} />
    </div>
  );
}
