"use client";

import { useEffect, useState } from "react";
import { GetAccountInfo, RecordFunds, IsLoggedIn, Logout } from "@/Controllers/AccountController";
import Link from "next/link";

export default function AccountPage() {
  const [user, setUser] = useState<{ email: string; username: string } | null>(null);
  const [funds, setFunds] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" });

  // decode token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        email: payload.email,
        username: payload.username,
      });
    } catch (e) {
      console.error("Failed to decode token:", e);
    }
  }, []);

  // load funds
  useEffect(() => {
    const loadFunds = async () => {
      if (!IsLoggedIn()) return;

      const info = await GetAccountInfo();
      if (info) setFunds(info.funds);
    };
    loadFunds();
  }, []);

  const handleAddFunds = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return;

    const success = await RecordFunds(num);
    if (success) {
      setAmount("");
      setSuccessMsg(`Successfully added ${formatCurrency(num)} to your account!`);

      const info = await GetAccountInfo();
      if (info) setFunds(info.funds);

      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  if (!user) return <p className="p-4 text-center">Not logged in</p>;

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Account</h1>

        <div className="flex gap-4">
          {/* Back to Store */}
          <button
            onClick={() => (window.location.href = "/store")}
            className="mt-3 ml-3 border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
          >
             Back to Store
          </button>
          {/* Logout */}
          <button
            onClick={() => {
              Logout();
              setUser(null);
              window.location.href = "/store";
            }}
            className="mt-3 ml-3 border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Profile */}
      <div className="bg-white shadow-sm rounded-xl p-5 space-y-1">
        <p className="text-gray-700"><strong>Username:</strong> {user.username}</p>
        <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
      </div>

      {/* Balance */}
      <div className="bg-white shadow-sm rounded-xl p-5">
        <p className="text-gray-500 text-sm">Current Balance</p>
        <p className="text-3xl font-semibold mt-1 text-green-600">
          {funds !== null ? formatCurrency(funds) : "$0.00"}
        </p>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="bg-green-100 border border-green-300 text-green-800 p-3 rounded-lg text-sm">
          {successMsg}
        </div>
      )}

      {/* Add Funds */}
      <div className="bg-white shadow-sm rounded-xl p-5 space-y-3">
        <h2 className="text-xl font-semibold">Add Funds</h2>

        <div className="flex items-center gap-3">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>

            <input
              type="text"
              className="border px-3 py-2 rounded w-full pl-7"
              value={amount}
              placeholder="0.00"
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9.]/g, "");
                setAmount(raw);
              }}
            />
          </div>

          <button
            onClick={handleAddFunds}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Add
          </button>
        </div>
      </div>
      <div className="bg-white shadow-sm rounded-xl p-5 space-y-3">
        <Link href="/account/order-history" className="mt-3 ml-3 border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100">
          Order History
        </Link>
      </div>
    </div>
  );
}
