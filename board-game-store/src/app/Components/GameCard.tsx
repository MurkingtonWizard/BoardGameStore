"use client";
import { IBoardGame } from "@/model";
import { useRouter } from "next/navigation";
import { OwnedButton } from "./OwnedButton";
import { RefreshProp } from "./PageWrapper";
import { IsLoggedIn, UpdateOwnedGame } from "@/Controllers";
import { useEffect, useState } from "react";

export function GameCard({ game, onRefresh }: {game: IBoardGame} & RefreshProp) {
  const router = useRouter();
  const [inCart, setInCart] = useState(false);

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

  const isInCart = () => {
    if (typeof window === "undefined") return false; // SSR safe
    const existingRaw = localStorage.getItem("checkoutGames");
    if (!existingRaw) return false;

    try {
      const existingCart = JSON.parse(existingRaw);
      if (!Array.isArray(existingCart)) return false;
      return existingCart.some((g: any) => g.id === game.id);
    } catch {
      return false;
    }
  };

  useEffect(()=> {
    setInCart(isInCart())
  },[])

  const toggleCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!IsLoggedIn()) {
      alert("Log in to use this feature");
      return;
    }

    const existingRaw = localStorage.getItem("checkoutGames");
    let existingCart: any[] = [];

    if (existingRaw) {
      try {
        existingCart = JSON.parse(existingRaw);
        if (!Array.isArray(existingCart)) existingCart = [existingCart];
      } catch {
        existingCart = [];
      }
    }

    let addedOrRemoved: boolean;
    if (existingCart.some(g => g.id === game.id)) {
      // Remove from cart
      existingCart = existingCart.filter(g => g.id !== game.id);
      addedOrRemoved = false;
    } else {
      // Add to cart
      existingCart.push(game);
      addedOrRemoved = true;
    }

    localStorage.setItem("checkoutGames", JSON.stringify(existingCart));
    setInCart(addedOrRemoved); 
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
      <div className="page-row" style={{width:"100%", justifyContent:"space-between", alignItems: "flex-start"}}>
        <div className="page-col" style={{justifyContent: "flex-start", alignItems:"flex-start", width: "70%"}}>
          <h2 className="text-xl font-semibold">{game.name}</h2>
          {game.price && (
            <p className="text-gray-600">${game.price.toFixed(2)}</p>
            )}
          {game.quantity !== 0 && (<p className="text-gray-600">Bought: {game.quantity}</p>)}
          <p className="text-sm text-gray-500 mt-2">
            {game.description.slice(0, 60)}...
          </p>
        </div>
        <div className="page-col" style={{fontSize: "12px", gap: "0.5em"}}>
          <OwnedButton ownedClick={ownedClick} isOwned={game.owned} quantity={game.quantity}/>
          <button
            className={`px-4 py-2 rounded font-semibold transition ${
              inCart ? "bg-red-600 hover:bg-red-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            type="button"
            onClick={toggleCart}
          >
            {inCart ? "Remove from Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
    
  );
}
