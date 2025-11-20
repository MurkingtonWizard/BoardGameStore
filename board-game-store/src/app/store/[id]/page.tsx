"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { IBoardGame } from "@/model/BoardGame";
import { Ratings } from "@/app/Components/Ratings";
import { Reviews } from "@/app/Components/Reviews";

import { FetchReimplementations, AddToLibrary, FetchGameRatings } from "@/Controllers/GameController";

export default function GameDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [game, setGame] = useState<IBoardGame | null>(null);
  const [parentGame, setParentGame] = useState<IBoardGame | null>(null);
  const [childGames, setChildGames] = useState<IBoardGame[]>([]);
  const [loadingReimpl, setLoadingReimpl] = useState<boolean>(false);

  const [storeRating, setStoreRating] = useState<number | null>(null);
  const [loadingRating, setLoadingRating] = useState<boolean>(false);


  useEffect(() => {
    const stored = localStorage.getItem("selectedGame");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (String(parsed.id) === String(id)) {
        setGame(parsed);
      }
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoadingReimpl(true);

    const loadReimpl = async () => {
      const result = await FetchReimplementations(Number(id));
      setParentGame(result.parent);
      setChildGames(result.children);
      setLoadingReimpl(false);
    };

    loadReimpl();
  }, [id]);

  const loadRating = async () => {
    setLoadingRating(true);
    const result = await FetchGameRatings(Number(id));
    setStoreRating(result.average);
    setLoadingRating(false);
  };

  useEffect(() => {
    if (id) loadRating();
  }, [id]);

  const goToGame = (g: IBoardGame) => {
    localStorage.setItem("selectedGame", JSON.stringify(g));
    router.push(`/store/${g.id}`);
  };

  if (!game) return <p className="pt-24 p-8">Loading...</p>;

  return (
    <main className="pt-24 p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image */}
        <img
          src={game.thumbnail}
          alt={game.name}
          className="w-full md:w-80 h-96 object-contain rounded shadow"
        />

        {/* Game Details */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">
            {game.name} <span>({game.year_published})</span>
          </h1>

          <p className="text-gray-600 mb-4">{game.description}</p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-base leading-relaxed">
            <p><strong>Price:</strong> ${game.price.toFixed(2)}</p>
            <p><strong>Players:</strong> {game.min_players}–{game.max_players}</p>
            <p><strong>Playtime:</strong> {game.playtime} min</p>
            <p><strong>Min Playtime:</strong> {game.min_playtime} min</p>
            <p><strong>Max Playtime:</strong> {game.max_playtime} min</p>
            <p><strong>Age:</strong> {game.min_age}+</p>
            <p><strong>BGG Score:</strong> {game.average_user_score}</p>
            <p><strong>Rank:</strong> #{game.rank}</p>

            {/* Store Page Rating */}
            <p>
              <strong>Store Page Rating:</strong>{" "}
              {loadingRating
                ? "Loading..."
                : storeRating !== null
                ? storeRating
                : "No ratings yet"}
            </p>
          </div>

          {/* Reimplementations */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-semibold mb-3">Reimplementations</h2>

            {loadingReimpl && <p>Loading...</p>}

            {!loadingReimpl && (
              <>
                {parentGame && (
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg">Original Game</h3>
                    <button
                      onClick={() => goToGame(parentGame)}
                      className="text-blue-600 hover:underline"
                    >
                      {parentGame.name} ({parentGame.year_published})
                    </button>
                  </div>
                )}
                {childGames.length > 0 && (
                  <div>
                    
                    <div className="flex flex-col gap-1 mt-2">
                      {childGames.map((g) => (
                        <button
                          key={g.id}
                          onClick={() => goToGame(g)}
                          className="text-blue-600 hover:underline text-left"
                        >
                          {g.name} ({g.year_published})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!parentGame && childGames.length === 0 && (
                  <p className="text-gray-500">No reimplementations</p>
                )}
              </>
            )}
          </div>

          {/* Ratings & Reviews */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-semibold mb-2">Rate</h2>
            <Ratings gameId={game.id} onRatingChange={loadRating} />
            <Reviews gameId={game.id} />
          </div>

          {/* Add to Library */}
          <button
            className="mt-6 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              const added = AddToLibrary(game);
              alert(
                added
                  ? `${game.name} added to your library!`
                  : `${game.name} is already in your library.`
              );
            }}
          >
            Add to Library
          </button>

          {/* Back */}
          <button
            onClick={() => router.push("/store")}
            className="mt-3 ml-3 border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
          >
            ← Back to Store
          </button>
        </div>
      </div>
    </main>
  );
}
