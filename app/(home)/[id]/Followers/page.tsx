import FollowList from "@/app/components/FollowList";
import User from "@/models/User";

const followers = ["user1", "user2", "user3", "user4", "user5"];
export default async function FollowersPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const user = await User.findById(id);
  return (
    <FollowList name={user.name} followingBool={false} id_list={followers} />
  );
}
