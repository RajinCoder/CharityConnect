"use client";
import Link from "next/link";
import { useState } from "react";

export default function UserProfileClient({
  user,
}: {
  user: { name: string; email: string } | null;
}) {
  const [name, setName] = useState(user?.name ?? "");
  const [isEditing, setIsEditing] = useState(false);

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
        <div className="follow">
          <Link href={`/${user?.name}/Following`} className="follow-list">
            Following
          </Link>
          <Link href={`/${user?.name}/Followers`} className="follow-list">
            Followers
          </Link>
        </div>
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
