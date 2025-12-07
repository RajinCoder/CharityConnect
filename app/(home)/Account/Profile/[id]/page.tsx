import UserProfile from "@/app/components/UserProfile";
import User from "@/models/User";

// should redirect you to your own profile page if you are logged in user
export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const user = await User.findById(id);
  return <UserProfile user={user} isOwner={false} />;
}
