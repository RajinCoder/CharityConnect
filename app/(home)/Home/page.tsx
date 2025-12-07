import Post from "@/app/components/Post";
import PostFilter from "@/app/components/PostFilter";
import dbConnect from "@/lib/mongoose";
import PostModel from "@/models/Post";
import CharityTaskBar from "@/app/components/CharityTaskBar";
import { getCurrentUser } from "@/lib/auth";
import Owners from "@/app/components/Owners";

interface CommitmentItem {
  itemId: string;
  name: string;
  needed: number;
  committed: number;
  icon: string;
}

interface Commitment {
  userName: string;
  commiterId: string;
  itemName: string;
  amount: number;
  date: string;
}

interface PostData {
  _id: string;
  imageUrl: string;
  caption: string;
  accountName: string;
  userId: string;
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
  const user = await getCurrentUser();

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6 justify-center">
            <div className="flex-1 max-w-4xl">
              {posts.length > 0 ? (
                <PostFilter
                  posts={posts.map((post) => ({
                    _id: post._id,
                    imageUrl: post.imageUrl,
                    caption: post.caption,
                    accountName: post.accountName,
                    userId: post.userId,
                    commitmentItems: post.commitmentItems.map((item) => ({
                      id: item.itemId,
                      name: item.name,
                      needed: item.needed,
                      committed: item.committed,
                      icon: item.icon,
                    })),
                    commitments: post.commitments,
                    date: post.date,
                  }))}
                  userName={user?.name}
                  userId={user?.id}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-500">No posts yet.</p>
                </div>
              )}
            </div>
            {user?.userType === "charity" && <CharityTaskBar />}
          </div>
        </div>
      </div>
      <Owners />
    </>
  );
}
