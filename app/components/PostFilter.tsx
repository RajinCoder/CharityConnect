"use client";

import { useState } from "react";
import Post from "./Post";

interface CommitmentItem {
  id: string;
  name: string;
  needed: number;
  committed: number;
  icon: string;
}

interface Commitment {
  userName: string;
  commiterId: string;
  itemName: string;
  amount: number;
  date: string;
}

interface PostData {
  _id: string;
  imageUrl: string;
  caption: string;
  accountName: string;
  userId: string;
  commitmentItems: CommitmentItem[];
  commitments: Commitment[];
  date: string;
}

interface PostFilterProps {
  posts: PostData[];
  userName?: string;
  userId?: string;
}

export default function PostFilter({ posts, userName, userId }: PostFilterProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");

  const itemTypeSet = new Set<string>();
  posts.map((post) => {
    post.commitmentItems.map((item) => {
      itemTypeSet.add(item.name);
    });
  });
  const itemTypes = Array.from(itemTypeSet).sort();

  let filteredPosts: PostData[] = [];
  const checkedItemNames = Object.keys(checkedItems).filter(
    (key) => checkedItems[key]
  );

  if (checkedItemNames.length === 0) {
    filteredPosts = posts;
  } else {
    filteredPosts = posts.filter((post) => {
      for (let i = 0; i < post.commitmentItems.length; i++) {
        if (checkedItemNames.includes(post.commitmentItems[i].name)) {
          return true;
        }
      }
      return false;
    });
  }

  const searchLower = searchQuery.toLowerCase();
  filteredPosts = filteredPosts.filter((post) => {
    if (post.accountName.toLowerCase().includes(searchLower)) {
      return true;
    }
    for (let i = 0; i < post.commitmentItems.length; i++) {
      if (post.commitmentItems[i].name.toLowerCase().includes(searchLower)) {
        return true;
      }
    }
    return false;
  });

  const handleCheckChange = (itemName: string) => {
    setCheckedItems({
      ...checkedItems,
      [itemName]: !checkedItems[itemName],
    });
  };

  return (
    <div className="w-full flex gap-6">
      <div className="w-64 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sticky top-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Filter by items:
          </label>
          <div className="space-y-2">
            {itemTypes.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checkedItems[type] || false}
                  onChange={() => handleCheckChange(type)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-lg flex flex-col gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
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
              userName={userName}
              committerUserId={userId}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No posts found.</p>
        )}
      </div>
    </div>
  );
}
