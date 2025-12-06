import Post from "@/app/components/Post";
import PostFilter from "@/app/components/PostFilter";
import dbConnect from "@/lib/mongoose";
import PostModel from "@/models/Post";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

interface CommitmentItem {
  itemId: string;
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

type UserPayload = {
  id: string;
  name: string;
  email: string;
};

async function getPosts(): Promise<PostData[]> {
  await dbConnect();
  const posts = await PostModel.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(posts));
}

export default async function DashboardPage() {
  const posts = await getPosts();
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  let user: UserPayload | null = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      user = payload as UserPayload;
    } catch (err) {
      // invalid or expired token
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {posts.length > 0 ? (
        <div className="flex justify-center">
          <PostFilter
            posts={posts.map((post) => ({
              _id: post._id,
              imageUrl: post.imageUrl,
              caption: post.caption,
              accountName: post.accountName,
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
          />
        </div>
      ) : (
        <div className="flex justify-center">
          <p className="text-gray-500">No posts yet.</p>
        </div>
      )}
    </div>
  );
}
