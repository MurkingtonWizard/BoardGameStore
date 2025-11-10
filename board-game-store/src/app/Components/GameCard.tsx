"use client";
import { IBoardGame } from "@/model";
import { useRouter } from "next/navigation";
import { OwnedButton } from "./OwnedButton";
import { RefreshProp } from "./PageWrapper";
import { IsLoggedIn, UpdateOwnedGame } from "@/Controllers";

export function GameCard({ game, onRefresh }: {game: IBoardGame} & RefreshProp) {
  const router = useRouter();

  const handleClick = () => {
    // Save the full game object to localStorage
    localStorage.setItem("selectedGame", JSON.stringify(game));

    // Navigate to the game page
    router.push(`/store/${game.id}`);
  };

  let ownedClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if(!IsLoggedIn()) {
        alert("Log in to use this feature");
        return;
    }
    if(await UpdateOwnedGame(game.id, game.owned ? "remove" : "add")) {
        onRefresh();
    }
  }
  let returnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if(!IsLoggedIn()) {
        alert("Log in to use this feature");
        return;
    }
    localStorage.setItem("returnGame", JSON.stringify(game));
    router.push(`/return/${game.id}`);
  }

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
      <div className="page-row" style={{width:"100%", justifyContent:"space-between", alignItems: "flex-start"}}>
        <div className="page-col" style={{justifyContent: "flex-start", alignItems:"flex-start"}}>
          <h2 className="text-xl font-semibold">{game.name}</h2>
          {game.price && (
            <p className="text-gray-600">${game.price.toFixed(2)}</p>
            )}
          {game.quantity !== 0 && (<p className="text-gray-600">Bought: {game.quantity}</p>)}
        </div>
        <OwnedButton ownedClick={ownedClick} returnClick={returnClick} isOwned={game.owned} quantity={game.quantity}/>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {game.description.slice(0, 60)}...
      </p>
    </div>
    
  );
}
