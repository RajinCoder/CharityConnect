import Link from "next/link";

//eventually will fetch the account data based on the id
// shouldn't be able to follow if your account
// if followed, should show unfollow button instead
export default function Account({
  user,
}: {
  user: { _id: string; name: string };
}) {
  return (
    <Link
      className="flex  p-2 justify-between items-center h-12 mb-2 rounded-md"
      href={`/Account/Profile/${user._id}`}
    >
      <div className="flex items-center gap-x-4">
        <div className="profile-phot w-8 h-8 rounded-full bg-amber-800"></div>
        <div>{user.name}</div>
      </div>

      <button className="btn">Follow</button>
    </Link>
  );
}
