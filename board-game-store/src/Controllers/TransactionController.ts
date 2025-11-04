import { IBoardGame } from "@/model";

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
    console.log("Owned:", payload);
    try {
        const response = await fetch('https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/Owned',
        {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        const resultData = await response.json();
        console.log(resultData);
        if(resultData.statusCode == 200) {
            console.log(resultData.body.games);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error fetching data:', error);
        return false;
    }
}