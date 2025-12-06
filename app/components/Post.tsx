"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faUtensils,
  faTshirt,
  faXmark,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { redirect } from "next/navigation";

interface Commitment {
  userName: string;
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
  commitmentItems: CommitmentItem[];
  commitments: Commitment[];
  date?: string;
  userName?: string;
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
  commitmentItems,
  commitments,
  date,
  userName,
}: PostProps) {
  const [showCommitments, setShowCommitments] = useState(false);
  const [makeCommitment, setMakeCommitment] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localCommitmentItems, setLocalCommitmentItems] =
    useState(commitmentItems);
  const [localCommitments, setLocalCommitments] = useState(commitments);
  const router = useRouter();

  const totalNeeded = localCommitmentItems.reduce(
    (sum, item) => sum + item.needed,
    0
  );
  const totalCommitted = localCommitmentItems.reduce(
    (sum, item) => sum + item.committed,
    0
  );
  const progressPercent = Math.round((totalCommitted / totalNeeded) * 100);

  const handleSubmitCommitment = async () => {
    setIsSubmitting(true);

    const commitmentData = Object.entries(selectedItems)
      .filter(([, amount]) => amount > 0)
      .map(([itemId, amount]) => ({ itemId, amount }));

    try {
      const response = await fetch("/api/commitments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          userName,
          commitments: commitmentData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLocalCommitmentItems(
          data.commitmentItems.map(
            (item: {
              itemId: string;
              name: string;
              needed: number;
              committed: number;
              icon: string;
            }) => ({
              id: item.itemId,
              name: item.name,
              needed: item.needed,
              committed: item.committed,
              icon: item.icon,
            })
          )
        );
        setLocalCommitments(data.commitments);
        setMakeCommitment(false);
        setSelectedItems({});
      } else {
        const error = await response.json();
        alert(error.error || "Failed to submit commitment");
      }
    } catch (error) {
      alert("Failed to submit commitment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-md">
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <button
              className="font-semibold"
              onClick={() =>
                (window.location.href = `/profile/${encodeURIComponent(
                  accountName
                )}`)
              }
            >
              {accountName}
            </button>
            {date && <p className="text-xs text-gray-500">{date}</p>}
          </div>

          <div className="flex items-center gap-2 ml-4">
            {localCommitmentItems.map((item, index) => (
              <div
                key={item.id || index}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Help {accountName}</h2>
              <button onClick={() => setShowCommitments(false)}>
                <FontAwesomeIcon
                  icon={faXmark}
                  className="text-gray-500 text-xl"
                />
              </button>
            </div>

            <div className="p-4 bg-gray-50">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold">
                  {totalCommitted} of {totalNeeded} items committed
                </span>
                <span className="text-green-600 font-bold">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex gap-4 mt-4 justify-center">
                {localCommitmentItems.map((item, index) => (
                  <div key={item.id || index} className="text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow mb-1">
                      <FontAwesomeIcon
                        icon={iconMap[item.icon] || faBox}
                        className="text-green-500 text-xl"
                      />
                    </div>
                    <p className="text-xs font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.committed}/{item.needed}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="font-semibold mb-3 text-gray-700">
                Recent Commitments
              </h3>
              {localCommitments.length > 0 ? (
                localCommitments.map((commitment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 py-2 border-b last:border-b-0"
                  >
                    <button
                      className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 hover:bg-gray-300"
                      onClick={() =>
                        (window.location.href = `/profile/${encodeURIComponent(
                          commitment.userName
                        )}`)
                      }
                    >
                      {commitment.userName.charAt(0).toUpperCase()}
                    </button>
                    <div className="flex-1">
                      <p className="text-sm">
                        <button 
                          onClick={() => (window.location.href = `/profile/${encodeURIComponent(commitment.userName)}`)}
                          className="font-semibold hover:text-green-600 hover:underline transition-colors"
                        >
                          {commitment.userName}
                        </button>{" "}
                        committed {commitment.amount} {commitment.itemName}
                      </p>
                      <p className="text-xs text-gray-400">{commitment.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">
                  No commitments yet. Be the first!
                </p>
              )}
            </div>

            <div className="p-4 border-t">
              <button
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold"
                onClick={() => {
                  if (!userName) {
                    router.push("/Account/Login");
                    return;
                  }
                  setShowCommitments(false);
                  setMakeCommitment(true);
                }}
              >
                Make a Commitment
              </button>
            </div>
          </div>
        </div>
      )}

      {makeCommitment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Make a Commitment</h2>
              <button
                onClick={() => {
                  setMakeCommitment(false);
                  setSelectedItems({});
                }}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  className="text-gray-500 text-xl"
                />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-gray-600 mb-4">
                Select items you want to commit to {accountName}:
              </p>

              {localCommitmentItems.map((item, index) => {
                const remaining = item.needed - item.committed;
                const currentAmount = selectedItems[item.id] || 0;

                return (
                  <div
                    key={item.id || index}
                    className="flex items-center gap-4 py-4 border-b last:border-b-0"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={iconMap[item.icon] || faBox}
                        className="text-green-500 text-xl"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {remaining} still needed
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (currentAmount > 0) {
                            setSelectedItems({
                              ...selectedItems,
                              [item.id]: currentAmount - 1,
                            });
                          }
                        }}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        disabled={currentAmount === 0}
                      >
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="text-gray-600 text-sm"
                        />
                      </button>

                      <span className="w-8 text-center font-semibold">
                        {currentAmount}
                      </span>

                      <button
                        onClick={() => {
                          if (currentAmount < remaining) {
                            setSelectedItems({
                              ...selectedItems,
                              [item.id]: currentAmount + 1,
                            });
                          }
                        }}
                        className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600"
                        disabled={currentAmount >= remaining}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="text-white text-sm"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Total items:</span>
                <span className="font-bold">
                  {Object.values(selectedItems).reduce(
                    (sum, val) => sum + val,
                    0
                  )}
                </span>
              </div>
              <button
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={
                  Object.values(selectedItems).reduce(
                    (sum, val) => sum + val,
                    0
                  ) === 0 || isSubmitting
                }
                onClick={handleSubmitCommitment}
              >
                {isSubmitting ? "Submitting" : "Confirm Commitment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
