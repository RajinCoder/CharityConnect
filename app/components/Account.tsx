import Link from "next/link";

import { useFollow } from "@/hooks/useFollow";

//fix the sub and id thing
export default function Account({
  user,
}: {
  user: { _id: string; name: string };
}) {
  const { followed, loading, isOwnAccount, handleFollow } = useFollow(user._id);
  return (
    <Link
      className="flex p-2 justify-between items-center h-12 mb-2 rounded-md"
      href={`/Account/Profile/${user._id}`}
    >
      <div className="flex items-center gap-x-4">
        <div className=" w-8 h-8 rounded-full bg-amber-800"></div>
        <div>{user.name}</div>
      </div>

      {!isOwnAccount && !loading && (
        <button onClick={handleFollow} className="btn">
          {followed ? "Unfollow" : "Follow"}
        </button>
      )}
    </Link>
  );
}
