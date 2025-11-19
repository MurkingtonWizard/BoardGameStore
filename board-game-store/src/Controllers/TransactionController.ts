import { IReturn, ITransaction } from "@/model";
import { IsLoggedIn } from "./AccountController";

const API_BASE = "https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial";

/** Safely gets the JWT token or returns null */
const getToken = (): string | null => {
    return localStorage.getItem("token");
};

/** Shared fetch wrapper */
const post = async (path: string, payload: any) => {
    try {
        const response = await fetch(`${API_BASE}/${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        return await response.json();
    } catch (err) {
        console.error(`POST ${path} failed:`, err);
        return { statusCode: 500, error: "Fetch error" };
    }
};

/* -------------------------------------------------------------------------- */
/*                              UpdateOwnedGame                               */
/* -------------------------------------------------------------------------- */

export const UpdateOwnedGame = async (
    boardGameID: number, 
    action: "add" | "remove"
): Promise<boolean> => {

    const token = getToken();
    if (!token) {
        console.error("UpdateOwnedGame: No token found");
        return false;
    }

    const payload = {
        token,
        gameId: boardGameID,
        update: action
    };

    const result = await post("Owned", payload);
    return result.statusCode === 200;
};

/* -------------------------------------------------------------------------- */
/*                             CreateTransaction                              */
/* -------------------------------------------------------------------------- */

export const CreateTransaction = async (
    transactions: { boardGameID: number; quantity: number }[]
): Promise<ITransaction | null> => {

    if (!IsLoggedIn()) {
        console.error("CreateTransaction: User not logged in");
        return null;
    }

    const token = getToken();
    if (!token) {
        console.error("CreateTransaction: Missing token");
        return null;
    }

    const payload = {
        token,
        transactions
    };

    const result = await post("Transaction", payload);

    if (result.statusCode === 200) {
        return result.body as ITransaction;
    }

    console.error("Transaction failed:", result);
    return null;
};

/* -------------------------------------------------------------------------- */
/*                               CreateReturn                                 */
/* -------------------------------------------------------------------------- */

export const CreateReturn = async (
    transaction: { boardGameID: number; quantity: number }
): Promise<IReturn | null> => {

    if (!IsLoggedIn()) {
        console.error("CreateReturn: User not logged in");
        return null;
    }

    const token = getToken();
    if (!token) {
        console.error("CreateReturn: Missing token");
        return null;
    }

    const payload = {
        token,
        transaction
    };

    const result = await post("Return", payload);

    if (result.statusCode === 200) {
        return result.body as IReturn;
    }

    console.error("Return failed:", result);
    return null;
};
