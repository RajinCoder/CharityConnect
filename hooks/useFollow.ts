/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

export function useFollow(targetUserId: string) {
  const [followed, setFollowed] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkFollowStatus() {
      const res = await fetch("/api/me");
      const data = await res.json();
      const my_user = data.user;
      setCurrentUser(my_user);

      if (my_user) {
        const statusRes = await fetch(
          `/api/follow/status?followerId=${my_user.sub}&followeeId=${targetUserId}`
        );
        const statusData = await statusRes.json();
        setFollowed(statusData.isFollowing);
      }
      setLoading(false);
    }

    checkFollowStatus();
  }, [targetUserId]);

  async function handleFollow(e?: React.MouseEvent) {
    e?.preventDefault();

    if (!currentUser) {
      alert("You must be logged in to follow or unfollow users.");
      return;
    }

    if (followed) {
      const response = await fetch("/api/unfollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unFollowerId: currentUser.sub,
          followeeId: targetUserId,
        }),
      });

      if (response.ok) {
        setFollowed(false);
      } else {
        alert((await response.json()).error);
      }
    } else {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followerId: currentUser.sub,
          followeeId: targetUserId,
        }),
      });

      if (response.ok) {
        setFollowed(true);
      } else {
        alert((await response.json()).error);
      }
    }
  }

  const isOwnAccount = currentUser?.sub === targetUserId;

  return { followed, loading, isOwnAccount, handleFollow, currentUser };
}