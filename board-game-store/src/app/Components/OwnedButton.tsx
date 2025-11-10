import { IsLoggedIn, UpdateOwnedGame } from "@/Controllers";
import { useState } from "react";
import { RefreshProp } from "./PageWrapper";

interface OwnedButtonProps {
    boardGameID: number,
    isOwned: boolean
}

export function OwnedButton({boardGameID, isOwned, onRefresh}:OwnedButtonProps & RefreshProp) {
    let ownedClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if(!IsLoggedIn()) {
            alert("Log in to use this feature");
            return;
        }
        if(await UpdateOwnedGame(boardGameID, isOwned ? "remove" : "add")) {
            onRefresh();
        }
    }

    if(IsLoggedIn() && isOwned) {
        return (
            <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                type="button" onClick={ownedClick}>
                Remove From Library
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