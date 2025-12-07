import UserProfile from "@/app/components/UserProfile";
import User from "@/models/User";
import Post from "@/models/Post";
import dbConnect from "@/lib/mongoose";

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  await dbConnect();
  const user = await User.findById(id).lean();
  
  if (!user) {
    return <div>User not found</div>;
  }
  
  const posts = await Post.find({ 
    $or: [
      { userId: id },
    ]
  }).sort({ createdAt: -1 }).lean();
  
  return <UserProfile user={user as any} isOwner={false} posts={JSON.parse(JSON.stringify(posts))} />;
}
