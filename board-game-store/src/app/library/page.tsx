"use client";

import React, { useState, useEffect } from "react";
import { IBoardGame } from "@/model/BoardGame";
import { FetchLibraryData, Footer, Header, LibraryHeaderProps } from "@/app/Components";

export default function LibraryPage() {
  const [library, setLibrary] = useState<IBoardGame[]>([]);
  
  const [games, setGames] = useState<IBoardGame[]>([]);

  // Load library from localStorage on page load
  useEffect(() => {
    const fetch = (async () => {
          const data = await FetchLibraryData("", null)
          setGames(data.games);
        })
        fetch();
        console.log("Library: Get games");
  }, []);

  // Function to remove a game
  const removeGame = (id: string) => {
    const updated = library.filter((game) => game.id !== id);
    setLibrary(updated);
    localStorage.setItem("library", JSON.stringify(updated));
  };

  return (
    <div>
      <Header type="library" results={games} setResults={setGames}/>
      <main className="pt-24 p-8">
        <h1 className="text-3xl font-bold mb-6">My Library</h1>
        {library.length === 0 ? (
          <p className="text-gray-500">You haven’t added any games yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {library.map((game) => (
              <div
                key={game.id}
                className="p-4 border rounded-xl shadow hover:shadow-lg transition"
              >
                <img
                  src={game.thumbnail}
                  alt={game.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h2 className="text-xl font-semibold">{game.name}</h2>
                <p className="text-gray-600">${game.price.toFixed(2)}</p>
                <button
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => removeGame(game.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer/>
    </div>
  );
}
