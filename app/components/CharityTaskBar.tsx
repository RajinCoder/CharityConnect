"use client";
import Image from "next/image";
import { IconStyle } from "@fortawesome/fontawesome-svg-core";
import { redirect } from "next/dist/server/api-utils";

export default function CharityTaskBar() {
  return (
    <div className="w-full flex gap-6">
      <div className="w-64 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <button
            aria-label="Create new post"
            className="flex items-center justify-center"
            onClick={() => (window.location.href = `/profile/createpost`)}
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
          </button>
        </div>
      </div>
    </div>
  );
}
