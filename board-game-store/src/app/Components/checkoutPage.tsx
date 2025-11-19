"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { CreateTransaction } from "@/Controllers/TransactionController";
import { GetAccountInfo, IsLoggedIn } from "@/Controllers/AccountController";

type CartGame = {
  id: string;
  title?: string;
  name?: string;
  price?: number;
};

type CheckoutItemProps = {
  game: { id: string; title: string; price?: number };
  quantity: number;
  setQuantity: (n: number) => void;
  onRemove: () => void;
  onCheckout: () => void;
};

function CheckoutItem({ game, quantity, setQuantity, onRemove, onCheckout }: CheckoutItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-200">
      <div className="flex-1 text-lg font-semibold">{game.title}</div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 font-bold"
        >
          -
        </button>

        <button className="px-4 py-1 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">
          Quantity: {quantity}
        </button>

        <button
          onClick={() => setQuantity(quantity + 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 font-bold"
        >
          +
        </button>
      </div>

      <button
        onClick={onCheckout}
        className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
      >
        Checkout
      </button>

      <button onClick={onRemove} className="p-2 hover:bg-gray-200 rounded transition">
        <TrashIcon className="w-6 h-6 text-red-600 hover:text-red-800" />
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const [games, setGames] = useState<CartGame[]>([]);
  const [quantities, setQuantities] = useState<number[]>([]);
  const [balance, setBalance] = useState<number>(0);

  // Load cart and balance
  useEffect(() => {
    // Load cart from localStorage
    const rawMulti = localStorage.getItem("checkoutGames");
    const rawSingle = localStorage.getItem("cartGame");
    let cart: CartGame[] = [];

    if (rawMulti) {
      try {
        const parsed = JSON.parse(rawMulti);
        if (Array.isArray(parsed)) cart = parsed.map(g => ({ ...g, price: Number(g.price ?? 0) }));
      } catch {}
    }

    if (rawSingle) {
      try {
        const parsed = JSON.parse(rawSingle);
        const gamePrice = Number(parsed.price ?? 0);
        if (!cart.some(g => g.id === parsed.id)) cart.push({ ...parsed, price: gamePrice });
      } catch {}
    }

    localStorage.setItem("checkoutGames", JSON.stringify(cart));
    setGames(cart);
    setQuantities(cart.map(() => 1));

    // Load account balance
    const loadBalance = async () => {
      if (!IsLoggedIn()) return;
      const info = await GetAccountInfo();
      if (info) setBalance(Number(info.funds));
    };
    loadBalance();
  }, []);

  const setQuantityAt = (index: number, value: number) => {
    setQuantities(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const removeAt = (index: number) => {
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
      alert(`Insufficient funds to checkout ${game.title} x${quantity}`);
      return;
    }

    const result = await CreateTransaction([{ boardGameID: Number(game.id), quantity }]);
    if (result) {
      alert(`Checkout successful: ${game.title} x${quantity}`);
      removeAt(index);

      const info = await GetAccountInfo();
      if (info) setBalance(Number(info.funds));
    } else {
      alert(`Checkout failed for ${game.title}`);
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
      localStorage.removeItem("cartGame");

      const info = await GetAccountInfo();
      if (info) setBalance(Number(info.funds));
    } else {
      alert("Checkout failed. Please try again.");
    }
  };

  const totalCost = Math.round(games.reduce((sum, g, i) => sum + (g.price ?? 0) * quantities[i], 0) * 100) / 100;

  const isInsufficient = totalCost > balance;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Checkout</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">Balance: ${balance.toFixed(2)}</span>
          <button
            onClick={() => router.push("/store")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Store
          </button>
        </div>
      </div>

      {games.length === 0 ? (
        <p className="text-gray-500">No items in cart.</p>
      ) : (
        <>
          {games.map((game, i) => (
            <CheckoutItem
              key={game.id}
              game={{ id: game.id, title: game.title ?? game.name ?? "Untitled", price: game.price }}
              quantity={quantities[i]}
              setQuantity={n => setQuantityAt(i, n)}
              onRemove={() => removeAt(i)}
              onCheckout={() => checkoutItem(i)}
            />
          ))}

          {/* Total Cost */}
          <div className="mt-4 text-right text-lg font-semibold">
            Total Cost:{" "}
            <span className={isInsufficient ? "text-red-600" : "text-gray-800"}>
              ${totalCost.toFixed(2)}
            </span>
            {isInsufficient && (
              <span className="ml-2 text-red-500 font-medium">(Insufficient funds)</span>
            )}
          </div>

          {/* Checkout All button */}
          <button
            onClick={checkoutAll}
            className="mt-6 w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
          >
            Checkout All
          </button>
        </>
      )}
    </div>
  );
}


