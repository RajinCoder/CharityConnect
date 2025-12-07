import FollowList from "@/app/components/FollowList";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

const following = [
  "jack@Nite",
  "ansh&bro_spam",
  "jitFloGrown",
  "rincewind52",
  "sperteca",
];

const following1 = ["691ffac06b57d78920168f87", "691ff9826b57d78920168f82"];
export default async function FollowingPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  await dbConnect();
  const user = await User.findById(id);

  const followingUsers = await User.find({
    _id: { $in: following1 }, //change to user.followingIds when implemented
  }).lean();
  return (
    <FollowList
      name={user.name}
      followingBool={true}
      users={JSON.parse(JSON.stringify(followingUsers))}
    />
  );
}
