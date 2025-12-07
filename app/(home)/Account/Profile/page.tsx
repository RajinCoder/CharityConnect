import UserProfile from "@/app/components/UserProfile";
import { getCurrentUser } from "@/lib/auth";
import Post from "@/models/Post";
import dbConnect from "@/lib/mongoose";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  
  await dbConnect();
  const posts = user?.id 
    ? await Post.find({ 
        $or: [
          { userId: user.id },
        ]
      }).sort({ createdAt: -1 }).lean()
    : [];
  
  return (
    <div className="m-auto">
      <UserProfile isOwner={true} user={user} posts={JSON.parse(JSON.stringify(posts))} />
    </div>
  );
}
