"use client";
import { useFollow } from "@/hooks/useFollow";
import Link from "next/link";
import { useState } from "react";

export default function UserProfileClient({
  user,
  isOwner,
}: {
  user: { _id: string; name: string; email: string } | null;
  isOwner: boolean;
}) {
  const [name, setName] = useState(user?.name ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const { followed, loading, handleFollow } = useFollow(user?._id ?? "");

  const handleSave = async () => {
    const response = await fetch("/api/auth/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user?.email, newName: name }),
    });

    if (response.ok) {
      setIsEditing(false);
    } else {
      alert("Failed to update profile.");
    }
  };
  return (
    <div>
      <div className="profile">
        <div className="profile-photo"></div>
        {user && (
          <div className="follow">
            <Link href={`/${user._id}/Following`} className="follow-link">
              Following
            </Link>
            <Link href={`/${user._id}/Followers`} className="follow-link">
              Followers
            </Link>
          </div>
        )}
        <div className="profile-details">
          <input
            placeholder="User Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input_box profile-name"
            disabled={!isEditing}
          />

          <input
            placeholder="User Email"
            defaultValue={user?.email}
            className="input_box profile-email"
            disabled
          />
          {isOwner ? (
            <div className="profile-btns">
              <button
                className="btn profile-edit-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button className="btn profile-save-btn" onClick={handleSave}>
                Save
              </button>
            </div>
          ) : (
            !loading && (
              <button onClick={handleFollow} className="btn">
                {followed ? "Unfollow" : "Follow"}
              </button>
            )
          )}
        </div>
      </div>

      <div className="pledged-posts">
        <div className="posts">
          <h2>Title of Post</h2>
          <div>List of pledges for that post</div>
        </div>
        <div className="posts">
          <h2>Title of Post</h2>
          <div>List of pledges for that post</div>
        </div>
      </div>
    </div>
  );
}
