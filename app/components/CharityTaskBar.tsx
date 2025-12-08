"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function CharityTaskBar() {
  return (
    <div className="w-64 flex-shrink-0 pl-6">
      <div className="sticky top-20 flex flex-col gap-4">
        <button
          aria-label="Create new post"
          onClick={() => (window.location.href = `/profile/createpost`)}
          className="bg-white rounded-lg shadow-md p-4 flex items-center gap-3 hover:shadow-lg transition-shadow"
        >
          <span className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <FontAwesomeIcon 
              icon={faPlus} 
              className="text-white text-lg"
            />
          </span>
          <span className="ml-1 text-gray-700 font-medium">Create New Post</span>
        </button>
      </div>
    </div>
  );
}
