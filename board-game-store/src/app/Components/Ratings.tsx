"use client";
import { useEffect, useState } from "react";

interface RatingsProps {
  gameId: string | number;
  onRatingChange?: () => void; 
}

export function Ratings({ gameId, onRatingChange }: RatingsProps) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

    const API_URL = "https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/Ratings";

    const token = localStorage.getItem("token");

  // fetch user's existing rating 
  useEffect(() => {
    const fetchUserRating = async () => {
      if (!token) return; // only fetch if logged in
      setLoading(true);

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "getUserRating",
            gameId: gameId,
            token: token, 
          }),
        });

        const data = await res.json();

        if (data.body?.number_rating) {
          setRating(Number(data.body.number_rating));
        }
      } catch (err) {
        console.error("Error fetching user rating:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRating();
  }, [token, gameId]);

  //  handle star rating 
  const handleClick = async (value: number) => {
    if (!token) {
      alert("Please log in to rate this game.");
      return;
    }

    setRating(value);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createOrUpdate",
          gameId: gameId,
          number_rating: value,
          text: null, 
          token: token, 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Rating saved:", data);
        if (onRatingChange) onRatingChange(); 
      } else {
        console.error("Error saving rating:", data.error);
      }
    } catch (err) {
      console.error("Network error saving rating:", err);
    }
  };

  return (
    <div className="flex items-center gap-1 mb-4">
      {loading ? (
        <p className="text-gray-500 text-sm">Loading rating...</p>
      ) : (
        [1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => handleClick(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill={star <= (hover || rating) ? "#facc15" : "#d1d5db"}
            className="w-7 h-7 cursor-pointer transition"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.973a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.387 2.463a1 1 0 00-.364 1.118l1.287 3.973c.3.921-.755 1.688-1.54 1.118l-3.388-2.463a1 1 0 00-1.175 0l-3.388 2.463c-.784.57-1.838-.197-1.539-1.118l1.286-3.973a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.973z" />
          </svg>
        ))
      )}
    </div>
  );
}