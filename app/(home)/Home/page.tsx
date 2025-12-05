import Post from "@/app/components/Post";
import dbConnect from "@/lib/mongoose";
import PostModel from "@/models/Post";

interface CommitmentItem {
  _id: string;
  name: string;
  needed: number;
  committed: number;
  icon: string;
}

interface Commitment {
  userName: string;
  itemName: string;
  amount: number;
  date: string;
}

interface PostData {
  _id: string;
  imageUrl: string;
  caption: string;
  accountName: string;
  commitmentItems: CommitmentItem[];
  commitments: Commitment[];
  date: string;
}

async function getPosts(): Promise<PostData[]> {
  await dbConnect();
  const posts = await PostModel.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(posts));
}

export default async function DashboardPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="w-full max-w-lg flex flex-col gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              imageUrl={post.imageUrl}
              caption={post.caption}
              accountName={post.accountName}
              commitmentItems={post.commitmentItems.map((item) => ({
                id: item._id,
                name: item.name,
                needed: item.needed,
                committed: item.committed,
                icon: item.icon,
              }))}
              commitments={post.commitments}
              date={post.date}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
