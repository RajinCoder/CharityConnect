/* eslint-disable @typescript-eslint/no-explicit-any */
import UserProfileClient from "./UserProfileClient";

export default async function UserProfile({
  user,
  isOwner,
  posts = [],
}: {
  user: {
    id?: string;
    _id?: any;
    name: string;
    email: string;
    userType: string;
  } | null;
  isOwner: boolean;
  posts?: any[];
}) {
  if (!user) return <h1>User not logged in</h1>;

  const userWithId = {
    _id: String(user.id || user._id || ""),
    name: user.name,
    email: user.email,
    userType: user.userType,
  };

  return (
    <UserProfileClient user={userWithId} isOwner={isOwner} posts={posts} />
  );
}
