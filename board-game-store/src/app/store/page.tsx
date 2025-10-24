"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IBoardGame } from "@/model/BoardGame";
import { FetchStoreData, Footer, Header, StoreHeaderProps } from "@/app/Components"

export default function StorePage() {
  const [games, setGames] = useState<IBoardGame[]>([]);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(0);

  useEffect(() => {
    const fetch = (async () => {
      const data = await FetchStoreData("", null, 1)
      setGames(data.games);
      setMaxPage(data.total_pages);
    })
    fetch();
    console.log("Store: Get page 1");
  }, []);

  return (
    <div>
      <Header type="store" results={games} setResults={setGames} page={page} setPage={setPage} maxPage={maxPage} setMaxPage={setMaxPage}/>
      <main className="pt-24 p-8">
        <h1 className="text-3xl font-bold mb-6">Browse Board Games</h1>
        <div className="grid grid-cols-3 gap-6">
          {games.map((game) => (
            <div key={game.id}>
              {/* Clicking card goes to detail page */}
              <Link href={`/store/${game.id}`}>
                <div className="p-4 border rounded-xl shadow hover:shadow-lg transition cursor-pointer">
                  <img
                    src={game.thumbnail}
                    alt={game.name}
                    className="w-full h-48 object-contain mb-4"
                  />
                  <h2 className="text-xl font-semibold">{game.name}</h2>
                  <p className="text-gray-600">${game.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {game.description.slice(0, 60)}...
                  </p>
                </div>
              </Link>

              {/* Add to Library button */}
              <button
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => {
                  const saved = localStorage.getItem("library");
                  const current = saved ? JSON.parse(saved) : [];
                  const exists = current.some(
                    (g: IBoardGame) => g.id === game.id
                  );
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
            </div>
          ))}
        </div>
        <div className="page-row">
          {Array.from({ length: maxPage }, (_, i) => i + 1).map((pageNumber, index, arr) => (
            <div key={pageNumber} className="page-link">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(pageNumber);
                }}
                className={page === pageNumber ? 'active' : ''}
              >
                {pageNumber}
              </a>
              {index < arr.length - 1 && <span>,</span>}
            </div>
          ))}
        </div>
      </main>
      <Footer/>
    </div>
  );
}
