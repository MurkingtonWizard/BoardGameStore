"use client";
import { useEffect, useState } from "react";

interface Review {
  user: string;
  email: string;
  text: string;
}

interface ReviewsProps {
  gameId: string | number;
}

export function Reviews({ gameId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL =
    "https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/Ratings";
  const token = localStorage.getItem("token");

  /** decode the user's email from token */
  const currentUserEmail = (() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.email as string;
    } catch {
      console.warn("Failed to decode token payload.");
      return null;
    }
  })();

  /** fetch all reviews */
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getGameRatings", gameId }),
      });

      const data = await res.json();
      const ratings = data.body?.ratings || [];

      const formatted = ratings
        .filter((r: any) => r.text?.trim()) // only keep non-empty reviews
        .map((r: any) => ({
          user: r.username || r.email,
          email: r.email,
          text: r.text.trim(),
        }));

      setReviews(formatted);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [gameId]);

  /** delete the current user's review */
  const handleDelete = async () => {
    if (!token) {
      alert("Please log in to delete your review.");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteReview", gameId, token }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Review deleted:", data);
        await fetchReviews();
      } else {
        console.warn("Error deleting review:", data.error);
      }
    } catch (err) {
      console.error("Network error deleting review:", err);
    }
  };

  /** submit a new review */
  const handleSubmit = async () => {
    if (!newReview.trim()) return;

    if (!token) {
      alert("Please log in to submit a review.");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createOrUpdate",
          gameId,
          number_rating: null,
          text: newReview.trim(),
          token,
        }),
      });

      const data = await res.json();

      if (res.ok && !data.error) {
        console.log("Review submitted successfully");
        setNewReview("");
        await fetchReviews();
      } else if (
        data.error?.includes("Missing valid rating") ||
        data.error?.includes("Submit a rating first")
      ) {
        alert("Please rate this game before writing a review.");
      } else {
        alert("Failed to submit review. Please try again later.");
      }
    } catch (err) {
      console.error("Network error submitting review:", err);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">Reviews</h3>

      {loading ? (
        <p className="text-gray-500 mb-4">Loading reviews...</p>
      ) : reviews.length > 0 ? (
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

              {currentUserEmail === r.email && (
                <button
                  onClick={handleDelete}
                  className="text-red-500 text-sm hover:text-red-700"
                  title="Delete review"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-4">No reviews yet</p>
      )}

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
