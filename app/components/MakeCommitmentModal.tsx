"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faUtensils, faTshirt, faXmark, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface CommitmentItem {
  id: string;
  name: string;
  needed: number;
  committed: number;
  icon: string;
}

interface MakeCommitmentModalProps {
  accountName: string;
  commitmentItems: CommitmentItem[];
  postId: string;
  userName?: string;
  committerUserId?: string;
  onClose: () => void;
  onSubmitSuccess: (commitmentItems: CommitmentItem[], commitments: any[]) => void;
}

const iconMap: Record<string, IconDefinition> = {
  box: faBox,
  food: faUtensils,
  clothing: faTshirt,
};

export default function MakeCommitmentModal({
  accountName,
  commitmentItems,
  postId,
  userName,
  committerUserId,
  onClose,
  onSubmitSuccess,
}: MakeCommitmentModalProps) {
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          userId: committerUserId,
          commitments: commitmentData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedCommitmentItems = data.commitmentItems.map(
          (item: {
            itemId: string;
            name: string;
            userId: string;
            needed: number;
            committed: number;
            icon: string;
          }) => ({
            id: item.itemId,
            name: item.name,
            userId: item.userId,
            needed: item.needed,
            committed: item.committed,
            icon: item.icon,
          })
        );
        onSubmitSuccess(updatedCommitmentItems, data.commitments);
        onClose();
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Make a Commitment</h2>
          <button onClick={onClose}>
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

          {commitmentItems.map((item, index) => {
            const remaining = item.needed - item.committed;
            const currentAmount = selectedItems[item.id] || 0;

            return (
              <div
                key={index}
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
  );
}
