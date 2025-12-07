"use client";

export default function CharityTaskBar() {
  return (
    <div className="w-full flex gap-6">
      <div className="w-64 flex-shrink-0">
        <div className="sticky top-20 flex flex-col gap-4">
          <button
            aria-label="Create new post"
            onClick={() => (window.location.href = `/profile/createpost`)}
            className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center gap-3"
          >
            <span className="w-10 h-10 bg-[#1f3550] rounded-lg flex items-center justify-center shadow-sm">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </span>
            <span className="ml-1 text-gray-700 font-medium">Create New Post</span>
          </button>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2">Charity Tasks</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Review new commitments</li>
              <li>Update needed items</li>
              <li>Engage with followers</li>
              <li>Plan upcoming campaigns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
