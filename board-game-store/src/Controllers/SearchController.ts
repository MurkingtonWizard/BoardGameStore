import { IBoardGame } from "@/model";

export type Filters = {
  minAge: number; maxAge: number;
  minPlayers: number; maxPlayers: number;
  minYear: number; maxYear: number;
  minPlaytime: number; maxPlaytime: number;
  minBGGScore: number; maxBGGScore: number;
  minStoreScore: number; maxStoreScore: number;
};
export type SearchResults = {
    games: IBoardGame[],
    total_pages: number
}

export const DefaultFilter: Filters = {
    minAge: 0,
    maxAge: 100,
    minPlayers: 1,
    maxPlayers: 100,
    minYear: -3000,
    maxYear: 2025,
    minPlaytime: 5,
    maxPlaytime: 1440,
    minBGGScore: 1,
    maxBGGScore: 10,
    minStoreScore: 1,
    maxStoreScore: 10,
} 
export type SearchContext = "library" | "store";

export const FetchGameSearch = async (search: string, filters: Filters | null, context: SearchContext, page: number=1): Promise<SearchResults> => {
    let token = localStorage.getItem('token'); // add token to search to toggle owned buttons
    if(filters === null) filters = DefaultFilter;
    const payload = {
        token,
        search,
        filters,
        page,
        context
    };
    console.log("Searching for:", payload);
    try {
        const response = await fetch('https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/SearchAndFilter',
        {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        const resultData = await response.json();
        if(resultData.statusCode == 200) {
            return {
                games: resultData.body.games as IBoardGame[],
                total_pages: (resultData.body.total_games / 10 + 1)
            };
        }
        return {
            games: [],
            total_pages: 0
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            games: [],
            total_pages: 0
        };
    }
}