"use client";
import { useEffect, useState } from "react";

interface ReviewsProps {
  gameId: string | number;
}

export function Reviews({ gameId }: ReviewsProps) {
  const [reviews, setReviews] = useState<{ user: string; text: string }[]>([]);
  const [newReview, setNewReview] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(`reviews_${gameId}`);
    if (stored) setReviews(JSON.parse(stored));
  }, [gameId]);

  const saveReviews = (updated: any[]) => {
    setReviews(updated);
    localStorage.setItem(`reviews_${gameId}`, JSON.stringify(updated));
  };

  const handleSubmit = () => {
    if (!newReview.trim()) return;
    const updated = [...reviews, { user: "Anonymous", text: newReview.trim() }];
    saveReviews(updated);
    setNewReview("");
  };

  const handleDelete = (index: number) => {
    const updated = reviews.filter((_, i) => i !== index);
    saveReviews(updated);
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">Reviews</h3>

      {/* Review list */}
      {reviews.length > 0 ? (
        <ul className="space-y-3 mb-4">
          {reviews.map((r, i) => (
            <li
              key={i}
              className="border rounded-lg p-3 bg-gray-50 flex justify-between items-start"
            >
              <div>
                <p className="font-medium text-gray-800">{r.user}</p>
                <p className="text-gray-700 text-sm mt-1">{r.text}</p>
              </div>
              <button
                onClick={() => handleDelete(i)}
                className="text-red-500 text-sm hover:text-red-700"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-4">No reviews yet</p>
      )}

      {/* Input box */}
      <textarea
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
        placeholder="Write your review..."
        className="w-full border rounded-lg p-2 mb-2 focus:outline-none focus:ring focus:ring-blue-200"
        rows={3}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Submit Review
      </button>
    </div>
  );
}
