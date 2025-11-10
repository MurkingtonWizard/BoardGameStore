'use client'
import { QuantityCount } from "@/app/Components";
import { IBoardGame } from "@/model";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReturnPage() {
    const router = useRouter();
    const { id } = useParams();
    const [game, setGame] = useState<IBoardGame | null>(null);
    const [returnAmt, setReturnAmt] = useState(1);

    useEffect(() => {
        const storedGame = localStorage.getItem("returnGame");
        if (storedGame) {
        const parsed = JSON.parse(storedGame);
        if (String(parsed.id) === String(id)) {
          setGame(parsed);
        }
    }
    }, [id]);
    
    if (!game) return <p className="pt-24 p-8">Loading...</p>;

    const handleReturn = () => {
        alert(`Returning ${returnAmt} copy/copies of ${game.name}`);
        router.back();
    };

    return (
    <div className="return-page">
      {/* Game Image */}
      <img
        src={game.thumbnail}
        alt={game.name}
        className="game-image"
      />

      {/* Info section */}
      <div className="game-info">
        <h2 className="game-title">{game.name}</h2>
        <p className="game-price">${game.price.toFixed(2)}</p>
        <p className="game-description">{game.description}</p>

        {/* Quantity Counter */}
        <div className="page-row" style={{justifyContent:"space-between"}}>
            
            <div className="total-return page-row" style={{gap: "2rem"}}>
                Return Amount: <QuantityCount amount={[returnAmt, setReturnAmt]} max={game.quantity} />
            </div>
            

            {/* Total */}
            <div className="total-return">
            Total refund: <span>${(game.price * returnAmt).toFixed(2)}</span>
            </div>

        </div>
        {/* Button */}
        <button className="return-button" onClick={handleReturn}>
          Return
        </button>
      </div>
    </div>
  );
}