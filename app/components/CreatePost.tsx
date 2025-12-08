"use client";
import { useState } from "react";

export default function CreatePost({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, number>>({});
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [customItemInput, setCustomItemInput] = useState("");

  const itemTypes = [
    "Clothes",
    "Food",
    "Books",
    "Toys",
    "Electronics",
    "Furniture",
    "Hygiene Products",
    "School Supplies",
    "Medical Supplies",
    "Canned Goods",
    "Bedding",
    "Household Items",
  ];

  const handleAddCustomItem = () => {
    const trimmed = customItemInput.trim();
    if (trimmed && !itemTypes.includes(trimmed) && !customItems.includes(trimmed)) {
      setCustomItems([...customItems, trimmed]);
      setCheckedItems({ ...checkedItems, [trimmed]: 1 });
      setCustomItemInput("");
    }
  };

  const handleRemoveCustomItem = (itemName: string) => {
    setCustomItems(customItems.filter(item => item !== itemName));
    const copy = { ...checkedItems };
    delete copy[itemName];
    setCheckedItems(copy);
  };

  const handleCheckChange = (itemName: string) => {
    setCheckedItems((prev) => {
      const exists = !!prev[itemName];
      if (exists) {
        const copy = { ...prev };
        delete copy[itemName];
        return copy;
      }
      return { ...prev, [itemName]: 1 };
    });
  };

  const handleNeededChange = (itemName: string, value: number) => {
    setCheckedItems((prev) => ({ ...prev, [itemName]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const commitmentItems = Object.entries(checkedItems)
        .filter(([, needed]) => !!needed)
        .map(([name, needed]) => ({ name, needed }));

      if (!caption.trim()) {
        setError("Please provide a caption for the post.");
        setLoading(false);
        return;
      }

      if (commitmentItems.length === 0) {
        setError("Select at least one needed item and specify the quantity.");
        setLoading(false);
        return;
      }

      const validateImageUrl = (url: string, timeout = 5000) =>
        new Promise<boolean>((resolve) => {
          if (!url) return resolve(false);
          const img = new Image();
          let timer = window.setTimeout(() => {
            img.src = "";
            resolve(false);
          }, timeout);
          img.onload = () => {
            clearTimeout(timer);
            resolve(true);
          };
          img.onerror = () => {
            clearTimeout(timer);
            resolve(false);
          };
          img.src = url;
        });

      const ok = await validateImageUrl(imageUrl);
      if (!ok) {
        setImageError("Image URL is not a valid or reachable image.");
        setLoading(false);
        return;
      }
      setImageError(null);


      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, caption, commitmentItems }),
      });
      if (!res.ok) throw new Error(await res.text());
      setImageUrl("");
      setCaption("");
      setCheckedItems({});
      onSuccess?.();
      window.location.href = `/`;
    } catch (err: any) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto">
      <form onSubmit={submit} className="space-y-4 flex-1">
      <label className="block">
        <span className="text-sm font-medium">Image URL</span>
        <input
          value={imageUrl}
          onChange={(e) => {
            setImageUrl(e.target.value);
            if (imageError) setImageError(null);
          }}
          className={`w-full mt-1 p-2 rounded border ${
            imageError ? "border-red-500" : "border-gray-300"
          }`}
        />
        {imageError && (
          <p className="text-sm text-red-600 mt-1">{imageError}</p>
        )}
      </label>

      <label className="block">
        <span className="text-sm font-medium">Caption</span>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </label>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
      <div className="border rounded-md bg-white p-4">
        <div className="flex flex-col gap-3">
          {(() => {
            const half = Math.ceil(itemTypes.length / 2);
            const row1 = itemTypes.slice(0, half);
            const row2 = itemTypes.slice(half);
            return (
              <>
                <div className="flex gap-6 overflow-x-auto py-1">
                  {row1.map((type) => (
                    <label
                      key={type}
                      className="inline-flex items-center gap-2 flex-shrink-0"
                    >
                      <input
                        type="checkbox"
                        checked={!!checkedItems[type]}
                        onChange={() => handleCheckChange(type)}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700 whitespace-nowrap">
                        {type}
                      </span>
                      {checkedItems[type] ? (
                        <input
                          type="number"
                          min={1}
                          value={checkedItems[type]}
                          onChange={(e) =>
                            handleNeededChange(
                              type,
                              Math.max(1, Number(e.target.value || 1))
                            )
                          }
                          className="ml-2 w-20 p-1 border rounded text-sm"
                        />
                      ) : null}
                    </label>
                  ))}
                </div>

                <div className="flex gap-6 overflow-x-auto py-1">
                  {row2.map((type) => (
                    <label
                      key={type}
                      className="inline-flex items-center gap-2 flex-shrink-0"
                    >
                      <input
                        type="checkbox"
                        checked={!!checkedItems[type]}
                        onChange={() => handleCheckChange(type)}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700 whitespace-nowrap">
                        {type}
                      </span>
                      {checkedItems[type] ? (
                        <input
                          type="number"
                          min={1}
                          value={checkedItems[type]}
                          onChange={(e) =>
                            handleNeededChange(
                              type,
                              Math.max(1, Number(e.target.value || 1))
                            )
                          }
                          className="ml-2 w-20 p-1 border rounded text-sm"
                        />
                      ) : null}
                    </label>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
        
        {/* Custom Item Input */}
        <div className="mt-4 pt-4 border-t">
          <label className="block text-sm font-medium mb-2">Add Custom Item:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customItemInput}
              onChange={(e) => setCustomItemInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomItem();
                }
              }}
              placeholder="e.g., Water Bottles"
              className="flex-1 p-2 border rounded text-sm"
            />
            <button
              type="button"
              onClick={handleAddCustomItem}
              className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>

        {/* Display Custom Items */}
        {customItems.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium mb-2">Custom Items:</p>
            <div className="flex flex-wrap gap-2">
              {customItems.map((item) => (
                <div key={item} className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded">
                  <span className="text-sm">{item}</span>
                  <input
                    type="number"
                    min={1}
                    value={checkedItems[item] || 1}
                    onChange={(e) =>
                      handleNeededChange(
                        item,
                        Math.max(1, Number(e.target.value || 1))
                      )
                    }
                    className="w-16 p-1 border rounded text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomItem(item)}
                    className="text-red-500 hover:text-red-700 font-bold"
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
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

      <aside className="w-full md:w-72 p-4 bg-white border rounded">
        <h4 className="font-semibold mb-2">Approved image URLs</h4>
        <p className="text-sm text-gray-700">
          Use images hosted on images.unsplash.com. Examples:
        </p>
        <ul className="mt-2 text-sm list-disc list-inside text-blue-700">
          <li>
            <a
              href="https://images.unsplash.com/photo-1608686207856-001b95cf60ca"
            >
              images.unsplash.com/photo-1608686207856-001b95cf60ca
            </a>
          </li>
          <li>
            <a
              href="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca"
            >
              images.unsplash.com/photo-1582213782179-e0d53f98f2ca
            </a>
          </li>
          <li>
            <a
              href="https://images.unsplash.com/photo-1593113598332-cd288d649433"
            >
              images.unsplash.com/photo-1593113598332-cd288d649433
            </a>
          </li>
        </ul>
      </aside>
    </div>
  );
}
