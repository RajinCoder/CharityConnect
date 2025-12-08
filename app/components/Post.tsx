"use client";
import Image from "next/image";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faUtensils, faTshirt } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import CommitmentProgressModal from "./CommitmentProgressModal";
import MakeCommitmentModal from "./MakeCommitmentModal";

interface Commitment {
  userName: string;
  commiterId: string;
  itemName: string;
  amount: number;
  date: string;
}

interface CommitmentItem {
  id: string;
  name: string;
  needed: number;
  committed: number;
  icon: string;
}

interface PostProps {
  postId: string;
  imageUrl: string;
  caption: string;
  accountName: string;
  userId: string;
  commitmentItems: CommitmentItem[];
  commitments: Commitment[];
  date?: string;
  userName?: string;
  committerUserId?: string;
  canDelete?: boolean;
  onDelete?: (postId: string) => void;
}

const iconMap: Record<string, IconDefinition> = {
  box: faBox,
  food: faUtensils,
  clothing: faTshirt,
};

export default function Post({
  postId,
  imageUrl,
  caption,
  accountName,
  userId,
  commitmentItems,
  commitments,
  date,
  userName,
  committerUserId,
  canDelete = false,
  onDelete,
}: PostProps) {
  const [showCommitments, setShowCommitments] = useState(false);
  const [makeCommitment, setMakeCommitment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localCommitmentItems, setLocalCommitmentItems] =
    useState(commitmentItems);
  const [localCommitments, setLocalCommitments] = useState(commitments);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete?.(postId);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete post");
      }
    } catch (error) {
      alert("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const totalNeeded = localCommitmentItems.reduce(
    (sum, item) => sum + item.needed,
    0
  );
  const totalCommitted = localCommitmentItems.reduce(
    (sum, item) => sum + item.committed,
    0
  );
  const progressPercent = Math.round((totalCommitted / totalNeeded) * 100);

  const handleCommitmentSuccess = (
    updatedCommitmentItems: CommitmentItem[],
    updatedCommitments: Commitment[]
  ) => {
    setLocalCommitmentItems(updatedCommitmentItems);
    setLocalCommitments(updatedCommitments);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-md mx-auto">
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <a
              href={`/Account/Profile/${encodeURIComponent(userId)}`}
              className="font-semibold truncate block"
            >
              {accountName}
            </a>
            {date && (
              <p className="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</p>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-500 hover:text-red-700 px-2 py-1 text-sm font-medium disabled:opacity-50"
                title="Delete post"
              >
                {isDeleting ? "Deleting" : "Delete"}
              </button>
            )}
            {localCommitmentItems.slice(0, 3).map((item, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0"
                  title={item.name}
                >
                  <FontAwesomeIcon
                    icon={iconMap[item.icon] || faBox}
                    className="text-green-500 text-med"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="relative w-full h-64">
        <Image src={imageUrl} alt={caption} fill className="object-cover" />
      </div>
      <div className="p-4">
        <p className="text-gray-800 mb-3">{caption}</p>

        <button
          onClick={() => setShowCommitments(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Commitment Progress
        </button>
        <div>
          Donation goal {progressPercent}% Completed
          <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden mt-2">
            <div
              className="bg-green-500 h-3 rounded-full transition-all absolute left-0 top-0"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {showCommitments && (
        <CommitmentProgressModal
          accountName={accountName}
          commitmentItems={localCommitmentItems}
          commitments={localCommitments}
          userName={userName}
          onClose={() => setShowCommitments(false)}
          onMakeCommitment={() => {
            setShowCommitments(false);
            setMakeCommitment(true);
          }}
        />
      )}

      {makeCommitment && (
        <MakeCommitmentModal
          accountName={accountName}
          commitmentItems={localCommitmentItems}
          postId={postId}
          userName={userName}
          committerUserId={committerUserId}
          onClose={() => setMakeCommitment(false)}
          onSubmitSuccess={handleCommitmentSuccess}
        />
      )}
    </div>
  );
}
