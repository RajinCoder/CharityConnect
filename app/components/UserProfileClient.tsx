/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useFollow } from "@/hooks/useFollow";
import Link from "next/link";
import { useState } from "react";
import Post from "./Post";
import { useRouter } from "next/navigation";

interface PostData {
  _id: string;
  imageUrl: string;
  caption: string;
  accountName: string;
  userId: string;
  commitmentItems: any[];
  commitments: any[];
  date: string;
}

export default function UserProfileClient({
  user,
  isOwner,
  posts = [],
}: {
  user: { _id: string; name: string; email: string; userType: string } | null;
  isOwner: boolean;
  posts?: PostData[];
}) {
  const router = useRouter();
  const [name, setName] = useState(user?.name ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const { followed, loading, handleFollow } = useFollow(user?._id ?? "");
  const [localPosts, setLocalPosts] = useState(posts);
  const [isSaving, setIsSaving] = useState(false);

  const handleDeletePost = (postId: string) => {
    setLocalPosts((prev) => prev.filter((post) => post._id !== postId));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, newName: name }),
      });

      if (response.ok) {
        setIsEditing(false);
        alert("Profile updated successfully!");
        router.refresh();
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
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
                disabled={isEditing}
              >
                Edit
              </button>
              <button
                className="btn profile-save-btn"
                onClick={handleSave}
                disabled={isSaving || !isEditing}
              >
                {isSaving ? "Saving..." : "Save"}
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
      {user?.userType === "charity" && (
        <>
          <h2 className="posts-heading mt-8 text-2xl font-bold text-center">
            {localPosts.length > 0
              ? `${isOwner ? "Your" : `${user?.name}'s`} posts`
              : "No posts yet"}
          </h2>
          <div className="pledged-posts">
            {localPosts.map((post) => (
              <Post
                key={post._id}
                postId={post._id}
                imageUrl={post.imageUrl}
                caption={post.caption}
                accountName={post.accountName}
                userId={post.userId}
                commitmentItems={post.commitmentItems}
                commitments={post.commitments}
                date={post.date}
                userName={user?.name}
                canDelete={isOwner}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
