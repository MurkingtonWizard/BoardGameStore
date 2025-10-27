"use client";
import { IBoardGame } from "@/model";
import { useRouter } from "next/navigation";

export function GameCard({ game }: {game: IBoardGame}) {
  const router = useRouter();

  const handleClick = () => {
    // Save the full game object to localStorage
    localStorage.setItem("selectedGame", JSON.stringify(game));

    // Navigate to the game page
    router.push(`/store/${game.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 border rounded-xl shadow hover:shadow-lg transition cursor-pointer"
    >
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
  );
}
