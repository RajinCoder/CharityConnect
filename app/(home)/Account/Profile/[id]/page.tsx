/* eslint-disable @typescript-eslint/no-explicit-any */
import UserProfile from "@/app/components/UserProfile";
import User from "@/models/User";
import Post from "@/models/Post";
import dbConnect from "@/lib/mongoose";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const currentUser = await getCurrentUser();

  if (currentUser && currentUser.id === id) {
    redirect("/Account/Profile");
  }

  await dbConnect();
  const user = await User.findById(id).lean();

  if (!user) {
    return <div>User not found</div>;
  }

  const posts = await Post.find({
    $or: [{ userId: id }],
  })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <UserProfile
      user={user as any}
      isOwner={false}
      posts={JSON.parse(JSON.stringify(posts))}
    />
  );
}
