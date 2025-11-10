"use client";
import { useEffect, useState } from "react";

interface ReviewsProps {
  gameId: string | number;
}

export function Reviews({ gameId }: ReviewsProps) {
  const [reviews, setReviews] = useState<{ user: string; text: string }[]>([]);
  const [newReview, setNewReview] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const API_URL =
    "https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/Ratings";

  const token = localStorage.getItem("token");

  // fetch all reviews for the game
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "getGameRatings",
            gameId: gameId,
          }),
        });

        const data = await res.json();
        const ratingsArray = data.body?.ratings || [];

        const formatted = ratingsArray.map((r: any) => ({
          user: r.username || r.email,
          text: r.text || "",
        }));

        setReviews(formatted);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [gameId]);

  // submit new review

/*
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
          gameId: gameId,
          number_rating: null,
          text: newReview.trim(),
          token: token, 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Review submitted:", data);

        // update UI 
        setReviews((prev) => [
          ...prev,
          { user: "You", text: newReview.trim() },
        ]);
        setNewReview("");
      } else {
        console.error("Error submitting review:", data.error);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };
*/
const handleSubmit = async () => {
  if (!newReview.trim()) return;
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in to submit a review.");
    return;
  }

  console.log("Submitting review:", {
    gameId,
    text: newReview.trim(),
    token: token.substring(0, 20) + "...", // shorten for logs
  });

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "createOrUpdate",
        gameId: gameId,
        number_rating: null,
        text: newReview.trim(),
        token: token,
      }),
    });

    const textResponse = await res.text(); // read as text first
    console.log("Raw Lambda response:", textResponse);

    let data;
    try {
      data = JSON.parse(textResponse);
    } catch {
      console.error("Failed to parse JSON from Lambda:", textResponse);
      return;
    }

    if (res.ok) {
      console.log("Review submitted successfully:", data);
      setReviews((prev) => [
        ...prev,
        { user: "You", text: newReview.trim() },
      ]);
      setNewReview("");
    } else {
      console.error("Error submitting review:", data.error);
    }
  } catch (err) {
    console.error("Network error submitting review:", err);
  }
};

  // delete a review
  const handleDelete = async (reviewUser: string) => {
    if (!token) {
      alert("Please log in to delete your review.");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deleteReview",
          gameId: gameId,
          token: token, 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Review deleted:", data);
        // remove deleted review from UI
        setReviews((prev) =>
          prev.filter((r) => r.user !== "You" && r.user !== reviewUser)
        );
      } else {
        console.error("Error deleting review:", data.error);
      }
    } catch (err) {
      console.error("Network error deleting review:", err);
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

              {/* delete button — only visible for your own review */}
              {r.user === "You" && (
                <button
                  onClick={() => handleDelete(r.user)}
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
