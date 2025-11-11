type RateGameAction = "getUserRating" | "createOrUpdate"

export const RateGame = async (boardGameID: number, action: RateGameAction, number_rating?: number): Promise<number> => {
    const API_URL = "https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/Ratings";
    
    let token = localStorage.getItem('token');
    if(token === null) return 0;
    
    const payload: Record<string, any> = {
        "token" : token,
        "action": action,
        "gameId": boardGameID,
    };
    if (action === "createOrUpdate" && number_rating !== undefined) {
        payload.number_rating = number_rating;
        payload.text = null; // optional text field
    }
    console.log(JSON.stringify(payload));
    try {
        const response = await fetch(API_URL,
        {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        const resultData = await response.json();
        console.log(resultData);
        if(resultData.statusCode == 200) {
            if (resultData.body?.number_rating) {
                return resultData.body.number_rating;
            }
        }
        return 0;
    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
}