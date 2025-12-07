import FollowList from "@/app/components/FollowList";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export default async function FollowersPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  await dbConnect();
  const user = await User.findById(id)
    .populate("followers", "name _id")
    .populate("following", "name _id");

  const followers = user.followers;
  console.log("Followers of user:", followers);
  return (
    <FollowList
      name={user.name}
      followingBool={false}
      users={JSON.parse(JSON.stringify(followers))}
    />
  );
}
