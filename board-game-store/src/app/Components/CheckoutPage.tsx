"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateTransaction, GetAccountInfo, IsLoggedIn } from "@/Controllers";
import { Icon } from "./IconLibrary";
import { QuantityCount } from "./QuantityCount";
import { IBoardGame } from "@/model";

type CheckoutItemProps = {
  game: { id: number; title: string; price: number };
  amount: [number, React.Dispatch<React.SetStateAction<number>>]
  balance: number,
  onRemove: () => void;
  onCheckout: () => void;
};

function CheckoutItem({ game, amount: [quantity, setQuantity], balance, onRemove, onCheckout }: CheckoutItemProps) {
  const [canCheckout, setCanCheckout] = useState(true)

  useEffect(()=>{
    setCanCheckout(balance >= game.price*quantity)
  }, [quantity, balance])
  
  return (
    <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-200">
      <div className="flex-1 text-lg font-semibold">{game.title}</div>
      <p>${(game.price * quantity).toFixed(2)}</p>
      <QuantityCount amount={[quantity, setQuantity]} max={99}/>
      <button
        onClick={onCheckout}
        className="checkoutButton"
        disabled={!canCheckout}
      >
        Checkout
      </button>

      <button onClick={onRemove} className="p-2 hover:bg-gray-200 rounded transition">
        <Icon type="Account" className="w-6 h-6 text-red-600 hover:text-red-800" />
      </button>
    </div>
  );
}

export function CheckoutPage() {
  const router = useRouter();
  const [games, setGames] = useState<IBoardGame[]>([]);
  const [quantities, setQuantities] = useState<number[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [canCheckout, setCanCheckout] = useState(true)


  const totalCost = () => {
    return games.reduce((sum, game, index) => {
      const quantity = quantities[index] ?? 0; 
      return sum + game.price * quantity;
    }, 0);
  }

  useEffect(()=>{
    setCanCheckout(balance >= totalCost())
  }, [quantities, balance])

  // Load cart and balance
  useEffect(() => {
    const storedCart = localStorage.getItem("checkoutGames");
    let cart: IBoardGame[] = [];

    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart) as any[];
        cart = parsed.map(g => ({
          ...g,
          price: Number(g.price ?? 0), // ensure price is number
        }));
      } catch (err) {
        console.error("Failed to parse checkoutGames from localStorage:", err);
      }
    }

    setGames(cart);
    setQuantities(cart.map(() => 1));

    // Save normalized cart back to localStorage
    localStorage.setItem("checkoutGames", JSON.stringify(cart));

    // Load account balance
    const loadBalance = async () => {
      if (!IsLoggedIn()) return;
      const info = await GetAccountInfo();
      if (info) setBalance(Number(info.funds));
    };
    loadBalance();
  }, []);

  const removeGameAt = (index: number) => {
    const newGames = [...games];
    newGames.splice(index, 1);
    setGames(newGames);

    const newQuantities = [...quantities];
    newQuantities.splice(index, 1);
    setQuantities(newQuantities);

    localStorage.setItem("checkoutGames", JSON.stringify(newGames));
  };

  const checkoutItem = async (index: number) => {
    const game = games[index];
    const quantity = quantities[index];
    const cost = Math.round((game.price ?? 0) * quantity * 100) / 100;

    if (cost > balance) {
      alert(`Insufficient funds to checkout ${game.name} x${quantity}`);
      return;
    }

    const result = await CreateTransaction([{ boardGameID: Number(game.id), quantity }]);
    if (result) {
      alert(`Checkout successful: ${game.name} x${quantity}`);
      removeGameAt(index);

      const info = await GetAccountInfo();
      if (info) setBalance(Number(info.funds));
    } else {
      alert(`Checkout failed for ${game.name}`);
    }
  };

  const checkoutAll = async () => {
    if (games.length === 0) return;

    const transactions = games.map((game, i) => ({
      boardGameID: Number(game.id),
      quantity: quantities[i],
    }));

    const total = Math.round(games.reduce((sum, g, i) => sum + (g.price ?? 0) * quantities[i], 0) * 100) / 100;

    if (total > balance) {
      alert("Warning: Insufficient funds for all items. Attempting checkout anyway.");
    }

    const result = await CreateTransaction(transactions);
    if (result) {
      alert("Checkout successful!");
      setGames([]);
      setQuantities([]);
      localStorage.removeItem("checkoutGames");
      router.push("/");

      const info = await GetAccountInfo();
      if (info) setBalance(Number(info.funds));
    } else {
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Checkout</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">Balance: ${balance.toFixed(2)}</span>
          <button
            onClick={() => router.push("/")}
            className="mt-3 ml-3 border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
          >
            ← Back to Store
          </button>
        </div>
      </div>

      {games.length === 0 ? (
        <p className="text-gray-500">No items in cart.</p>
      ) : (
        <>
          {games.map((game, i) => {
            const amount: [number, React.Dispatch<React.SetStateAction<number>>] = [
              quantities[i],
              (newValue) => {
                setQuantities(prev => {
                  const updated = [...prev];
                  updated[i] = typeof newValue === 'function' ? newValue(prev[i]) : newValue;
                  return updated;
                });
              }
            ];

            return <CheckoutItem
              key={game.id}
              game={{ id: game.id, title: game.name ?? game.name ?? "Untitled", price: game.price }}
              amount={amount}
              balance={balance}
              onRemove={() => removeGameAt(i)}
              onCheckout={() => checkoutItem(i)}
            />
          })}

          {/* Total Cost */}
          <div className="mt-4 text-right text-lg font-semibold">
            Total Cost:{" "}
            <span className={!canCheckout ? "text-red-600" : "text-gray-800"}>
              ${totalCost().toFixed(2)}
            </span>
            {!canCheckout && (
              <span className="ml-2 text-red-500 font-medium">(Insufficient funds)</span>
            )}
          </div>

          {/* Checkout All button */}
          <button
            onClick={checkoutAll}
            className="checkoutButton checkoutButtonFull"
            disabled={!canCheckout}
          >
            Checkout All
          </button>
        </>
      )}
    </div>
  );
}


