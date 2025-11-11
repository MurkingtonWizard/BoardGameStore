import { IsLoggedIn, UpdateOwnedGame } from "@/Controllers";
import { useState } from "react";
import { RefreshProp } from "./PageWrapper";
import { useRouter } from "next/navigation";

interface OwnedButtonProps {
    ownedClick: (e: React.MouseEvent<HTMLButtonElement>) => void,
    returnClick: (e: React.MouseEvent<HTMLButtonElement>) => void,
    isOwned: boolean,
    quantity: number
}

export function OwnedButton({ownedClick, returnClick, isOwned, quantity}:OwnedButtonProps) {
        if(IsLoggedIn() && isOwned && quantity === 0) {
        return (
            <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                type="button" onClick={ownedClick}>
                Remove
            </button>
        );
    } else if (IsLoggedIn() && quantity !== 0) {
        return (
            <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                type="button" onClick={returnClick}>
                Return
            </button>
        );
    }


    return (
        <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            type="button" onClick={ownedClick}>
            Add To Library
        </button>
    );
}