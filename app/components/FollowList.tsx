"use client";

import { useState } from "react";
import Account from "./Account";

export default function FollowList({
  name,
  followingBool,
  users,
}: {
  name: string;
  followingBool: boolean;
  users: { _id: string; name: string }[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };
  return (
    <div className="follow-box">
      <h2 className="follow-owner">
        {name} {followingBool ? "Following" : "Followers"}
      </h2>
      <div className="follow-rest  p-4">
        <input
          className="input_box"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <ul className="follow-list-container">
          {filteredUsers.map((user) => (
            <Account key={user._id} user={user} />
          ))}
        </ul>
      </div>
    </div>
  );
}
