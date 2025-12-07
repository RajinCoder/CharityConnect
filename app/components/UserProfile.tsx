import UserProfileClient from "./UserProfileClient";

export default async function UserProfile({
  user,
  isOwner,
}: {
  user: { id: string; name: string; email: string } | null;
  isOwner: boolean;
}) {
  if (!user) return <h1>User not logged in</h1>;

  const userWithId = {
    _id: user.id, // map JWT id to _id
    name: user.name,
    email: user.email,
  };
  return <UserProfileClient user={userWithId} isOwner={isOwner} />;
}
