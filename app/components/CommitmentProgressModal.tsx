"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faUtensils, faTshirt, faXmark } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import Link from "next/link";

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

interface CommitmentProgressModalProps {
  accountName: string;
  commitmentItems: CommitmentItem[];
  commitments: Commitment[];
  userName?: string;
  onClose: () => void;
  onMakeCommitment: () => void;
}

const iconMap: Record<string, IconDefinition> = {
  box: faBox,
  food: faUtensils,
  clothing: faTshirt,
};

const formatTimestamp = (iso?: string) => {
  if (!iso) return "";
  const t = Date.parse(iso);
  const diff = Date.now() - t;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < hour) {
    const mins = Math.max(1, Math.floor(diff / minute));
    return `${mins}m ago`;
  }
  if (diff < day) {
    const hrs = Math.max(1, Math.floor(diff / hour));
    return `${hrs}h ago`;
  }
  const d = new Date(t);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export default function CommitmentProgressModal({
  accountName,
  commitmentItems,
  commitments,
  userName,
  onClose,
  onMakeCommitment,
}: CommitmentProgressModalProps) {
  const totalNeeded = commitmentItems.reduce((sum, item) => sum + item.needed, 0);
  const totalCommitted = commitmentItems.reduce((sum, item) => sum + item.committed, 0);
  const progressPercent = Math.round((totalCommitted / totalNeeded) * 100);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Help {accountName}</h2>
          <button onClick={onClose}>
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
            {commitmentItems.map((item) => (
              <div key={item.id} className="text-center">
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
          {commitments.length > 0 ? (
            commitments.map((commitment, index) => (
              <div
                key={index}
                className="flex items-center gap-3 py-2 border-b last:border-b-0"
              >
                <a
                  href={`Account/Profile/${encodeURIComponent(
                    commitment.commiterId
                  )}`}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 hover:bg-gray-300"
                >
                  {commitment.userName.charAt(0).toUpperCase()}
                </a>
                <div className="flex-1">
                  <p className="text-sm">
                    <a
                      href={`/Account/Profile/${encodeURIComponent(
                        commitment.commiterId
                      )}`}
                      className="font-semibold hover:text-green-600 hover:underline transition-colors"
                    >
                      {commitment.userName}
                    </a>{" "}
                    committed {commitment.amount} {commitment.itemName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatTimestamp(commitment.date)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center py-4">
              No commitments yet.
            </p>
          )}
        </div>
        <div className="p-4 border-t">
          {!userName ? (
            <Link
              href="/Account/Login"
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold block text-center"
            >
              Login to Make a Commitment
            </Link>
          ) : (
            <button
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold"
              onClick={onMakeCommitment}
            >
              Make a Commitment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
