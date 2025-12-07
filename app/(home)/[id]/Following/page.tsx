import FollowList from "@/app/components/FollowList";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export default async function FollowingPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  await dbConnect();
  const user = await User.findById(id)
    .populate("followers", "name _id")
    .populate("following", "name _id");

  const followingUsers = user.following;
  return (
    <FollowList
      name={user.name}
      followingBool={true}
      users={JSON.parse(JSON.stringify(followingUsers))}
    />
  );
}
