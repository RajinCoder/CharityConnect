import UserProfileClient from "./UserProfileClient";

export default async function UserProfile({
  user,
  isOwner,
  posts = [],
}: {
  user: { id?: string; _id?: any; name: string; email: string } | null;
  isOwner: boolean;
  posts?: any[];
}) {
  if (!user) return <h1>User not logged in</h1>;

  const userWithId = {
    _id: String(user.id || user._id || ''),
    name: user.name,
    email: user.email,
  };
  
  return <UserProfileClient user={userWithId} isOwner={isOwner} posts={posts} />;
}
