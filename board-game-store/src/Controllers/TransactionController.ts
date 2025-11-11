import { IReturn, ITransaction } from "@/model";
import { IsLoggedIn } from "./AccountController";

export type OwnedAction = "add" | "remove";

export const UpdateOwnedGame = async (boardGameID: number, action: OwnedAction): Promise<boolean> => {
    let token = localStorage.getItem('token');
    if(token === null) return false;
    // check token exists
    const payload = {
        "token" : token,
        "gameId" : boardGameID,
        "update" : action
    };
    try {
        const response = await fetch('https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/Owned',
        {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        const resultData = await response.json();
        return resultData.statusCode === 200;
    } catch (error) {
        console.error('Error fetching data:', error);
        return false;
    }
}

export const CreateTransaction = async (transactions: {boardGameID: number, quantity: number}[]): Promise<ITransaction | boolean> => {
    if(!IsLoggedIn) return false;
    const payload = {
        "token" : localStorage.getItem('token'),
        transactions
    };
    try {
        const response = await fetch('https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/Transaction',
        {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        const resultData = await response.json();
        if(resultData.statusCode === 200) {
            return resultData.body;
        }
        return false;
    } catch (error) {
        console.error('Error fetching data:', error);
        return false;
    }
}

export const CreateReturn = async (transaction: {boardGameID: number, quantity: number}): Promise<IReturn | boolean> => {
    if(!IsLoggedIn) return false;
    const payload = {
        "token" : localStorage.getItem('token'),
        transaction
    };
    try {
        const response = await fetch('https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/Return',
        {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        const resultData = await response.json();
        if(resultData.statusCode === 200) {
            return resultData.body;
        }
        return false;
    } catch (error) {
        console.error('Error fetching data:', error);
        return false;
    }
}