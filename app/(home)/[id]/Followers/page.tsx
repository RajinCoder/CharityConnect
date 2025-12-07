import FollowList from "@/app/components/FollowList";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

const followers = [
  "69348a462e38e4959c124ba8",
  "6934898a2e38e4959c124ba0",
  "693489722e38e4959c124b9b",
  "6934895f2e38e4959c124b96",
];

export default async function FollowersPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  await dbConnect();
  const user = await User.findById(id);

  const followerUsers = await User.find({
    _id: { $in: followers }, //change to user.followingIds when implemented
  }).lean();
  return (
    <FollowList
      name={user.name}
      followingBool={false}
      users={JSON.parse(JSON.stringify(followerUsers))}
    />
  );
}
