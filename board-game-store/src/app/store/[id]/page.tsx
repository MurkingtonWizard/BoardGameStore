"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IBoardGame } from "@/model/BoardGame";
import { Ratings } from "@/app/Components/Ratings";
import { Reviews } from "@/app/Components/Reviews";

export default function GameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState<IBoardGame | null>(null);
  const [storeRating, setStoreRating] = useState<number | null>(null);
  const [loadingRating, setLoadingRating] = useState<boolean>(false);

  const API_URL = "https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/Ratings";

  useEffect(() => {
    const storedGame = localStorage.getItem("selectedGame");
    if (storedGame) {
      const parsed = JSON.parse(storedGame);
      if (String(parsed.id) === String(id)) {
        setGame(parsed);
      }
    }
  }, [id]);


  const fetchGameData = async () => {
    if (!id) return;
    setLoadingRating(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getGameRatings",
          gameId: id,
        }),
      });
      const data = await res.json();

      if (data.body?.ratings?.length > 0) {
        // compute the average store page rating
        const avg =
          data.body.ratings.reduce(
            (sum: number, r: any) => sum + (r.number_rating || 0),
            0
          ) / data.body.ratings.length;
        setStoreRating(Number(avg.toFixed(1)));
      } else {
        setStoreRating(null);
      }
    } catch (err) {
      console.error("Error fetching game rating data:", err);
    } finally {
      setLoadingRating(false);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, [id]);

  if (!game) return <p className="pt-24 p-8">Loading...</p>;

  return (
    <main className="pt-24 p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Game image */}
        <img
          src={game.thumbnail}
          alt={game.name}
          className="w-full md:w-80 h-96 object-contain rounded shadow"
        />

        {/* Game details */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">
            {game.name}{" "}
            <span className="text-4xl font-bold mb-4">
              ({game.year_published})
            </span>
          </h1>
          <p className="text-gray-600 mb-4">{game.description}</p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-base leading-relaxed">
            <p>
              <strong>Price:</strong> ${game.price.toFixed(2)}
            </p>
            <p>
              <strong>Players:</strong> {game.min_players}–{game.max_players}
            </p>
            <p>
              <strong>Playtime:</strong> {game.playtime} min
            </p>
            <p>
              <strong>Min Playtime:</strong> {game.min_playtime} min
            </p>
            <p>
              <strong>Max Playtime:</strong> {game.max_playtime} min
            </p>
            <p>
              <strong>Age:</strong> {game.min_age}+
            </p>
            <p>
              <strong>BGG Score:</strong> {game.BGG_score}
            </p>
            <p>
              <strong>Average User Rating:</strong> {game.average_user_score}
            </p>
            {game.users_rated && (
              <p>
                <strong>Users Rated:</strong>{" "}
                {game.users_rated.toLocaleString()}
              </p>
            )}
            <p>
              <strong>Rank:</strong> #{game.rank}
            </p>
            <p>
              <strong>Store Page Rating:</strong>{" "}
              {loadingRating
                ? "Loading..."
                : storeRating !== null
                ? storeRating
                : "No ratings yet"}
            </p>
          </div>

          {/* store page rating + reviews */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-semibold mb-2">Rate</h2>

            {/* star rating component */}
            <Ratings
              gameId={game.id}
              onRatingChange={fetchGameData} 
            />

            {/* reviews list and input */}
            <Reviews gameId={game.id} />
          </div>

          {/* Mechanics */}
          {game.mechanics?.length > 0 && (
            <div className="mt-4">
              <h2 className="font-semibold text-lg">Mechanics</h2>
              <p className="text-gray-700">{game.mechanics.join(", ")}</p>
            </div>
          )}

          {/* categories */}
          {game.categories?.length > 0 && (
            <div className="mt-4">
              <h2 className="font-semibold text-lg">Categories</h2>
              <p className="text-gray-700">{game.categories.join(", ")}</p>
            </div>
          )}

          {/* family */}
          {game.family?.length > 0 && (
            <div className="mt-4">
              <h2 className="font-semibold text-lg">Family</h2>
              <p className="text-gray-700">{game.family.join(", ")}</p>
            </div>
          )}

          {/* Add to Library button */}
          <button
            className="mt-6 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              const saved = localStorage.getItem("library");
              const current = saved ? JSON.parse(saved) : [];
              const exists = current.some((g: IBoardGame) => g.id === game.id);
              if (!exists) {
                current.push(game);
                localStorage.setItem("library", JSON.stringify(current));
                alert(`${game.name} added to your library!`);
              } else {
                alert(`${game.name} is already in your library.`);
              }
            }}
          >
            Add to Library
          </button>

          {/* Back button */}
          <button
            onClick={() => window.history.back()}
            className="mt-3 ml-3 border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
          >
            ← Back to Store
          </button>
        </div>
      </div>
    </main>
  );
}
