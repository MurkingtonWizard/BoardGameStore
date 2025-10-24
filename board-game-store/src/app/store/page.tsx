"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IBoardGame } from "../../model/BoardGame";

export default function StorePage() {
  const [games, setGames] = useState<IBoardGame[]>([]);

  useEffect(() => {
    // mock data for now
    const mockGames: IBoardGame[] = [
      {
        id: "1",
        name: "Catan",
        description: "Trade, build, and settle the island of Catan.",
        year_published: 1995,
        min_players: 3,
        max_players: 4,
        min_age: 10,
        min_playtime: 60,
        max_playtime: 120,
        playtime: 90,
        thumbnail:
          "https://cf.geekdo-images.com/0XODRpReiZBFUffEcqT5-Q__itemrep@2x/img/81lS9PRn2JwyE4br1l7Z5fgSyFo=/fit-in/492x600/filters:strip_icc()/pic9156909.png",
        url: "https://boardgamegeek.com/boardgame/13/catan",
        price: 29.99,
        BGG_score: 7.1,
        users_rated: 120000,
        average_user_score: 7.2,
        rank: 123,
        store_page_rating: 4.5,
        implementations: [],
        expansions: [],
        family: ["Strategy"],
        mechanics: ["Trading", "Dice Rolling"],
        categories: ["Economic", "Negotiation"],
      },
      {
        id: "2",
        name: "Ticket to Ride",
        description: "Build train routes across North America.",
        year_published: 2004,
        min_players: 2,
        max_players: 5,
        min_age: 8,
        min_playtime: 30,
        max_playtime: 60,
        playtime: 45,
        thumbnail: "https://cf.geekdo-images.com/kdWYkW-7AqG63HhqPL6ekA__itemrep@2x/img/nAI08lHzxwXX2mVrNcBms4FEO_o=/fit-in/492x600/filters:strip_icc()/pic8937637.jpg",
        url: "https://boardgamegeek.com/boardgame/9209/ticket-ride",
        price: 34.99,
        BGG_score: 7.5,
        users_rated: 90000,
        average_user_score: 7.6,
        rank: 200,
        store_page_rating: 4.7,
        implementations: [],
        expansions: [],
        family: ["Train Games"],
        mechanics: ["Set Collection"],
        categories: ["Family", "Travel"],
      },
      {
        id: "3",
        name: "Pandemic",
        description: "In Pandemic, several virulent diseases have broken out simultaneously all over the world!",
        year_published: 2008,
        min_players: 2,
        max_players: 4,
        min_age: 8,
        min_playtime: 45,
        max_playtime: 45,
        playtime: 45,
        thumbnail: "https://cf.geekdo-images.com/S3ybV1LAp-8SnHIXLLjVqA__itemrep@2x/img/qnS9n-lo85ht2reXk7MsdbgeQfM=/fit-in/492x600/filters:strip_icc()/pic1534148.jpg",
        url: "https://boardgamegeek.com/boardgame/30549/pandemic",
        price: 49.99,
        BGG_score: 7.59,
        users_rated: 108975,
        average_user_score: 7.6,
        rank: 106,
        store_page_rating: 4.7,
        implementations: [],
        expansions: [],
        family: ["Multi-Use Cards"],
        mechanics: ["Action Points", "Cooperative Game", "Hand Management", "Point to Point Movement", "Set Collection", "Trading", "Variable Player Powers"],
        categories: ["Medical"],
      },
      {
        id: "4",
        name: "Carcassonne",
        description: "Carcassonne is a tile-placement game in which the players draw and place a tile with a piece of southern French landscape on it. The tile might feature a city, a road, a cloister, grassland or some combination thereof, and it must be placed adjacent to tiles that have already been played, in such a way that cities are connected to cities, roads to roads, etcetera.",
        year_published: 2000,
        min_players: 2,
        max_players: 5,
        min_age: 7,
        min_playtime: 35,
        max_playtime: 45,
        playtime: 45,
        thumbnail: "https://cf.geekdo-images.com/okM0dq_bEXnbyQTOvHfwRA__itemrep@2x/img/3iQ5F-ut9a6g8_NGmnyzGlF8BLo=/fit-in/492x600/filters:strip_icc()/pic6544250.png",
        url: "https://boardgamegeek.com/boardgame/822/carcassonne",
        price: 41.99,
        BGG_score: 7.42,
        users_rated: 108738,
        average_user_score: 7.6,
        rank: 190,
        store_page_rating: 4.7,
        implementations: [],
        expansions: [],
        family: [],
        mechanics: ["Area Majority / Influence", "Map Addition", "Tile Placement"],
        categories: ["City Building", "Medieval", "Territory Building"],
      }, 
    ];
    setGames(mockGames);
    localStorage.setItem("games", JSON.stringify(mockGames)); // save for details page
  }, []);

  return (
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
    </main>
  );
}
