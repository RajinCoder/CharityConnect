"use client";
import Image from "next/image";
import { IconStyle } from "@fortawesome/fontawesome-svg-core";
import { redirect } from "next/dist/server/api-utils";
import { useState } from "react";

export default function CreatePost({ onSuccess }: { onSuccess?: () => void } = {}) {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, caption }),
      });
      if (!res.ok) throw new Error(await res.text());
      setImageUrl("");
      setCaption("");
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Image URL</span>
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Caption</span>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
