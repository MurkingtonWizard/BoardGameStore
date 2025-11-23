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
    try {
        const response = await fetch('https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/SearchAndFilter',
        {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        const resultData = await response.json();
        if(resultData.statusCode == 200) {
            const games: IBoardGame[] = resultData.body.games.map(MapToBoardGame);
            return {
                games: games,
                total_pages: Math.ceil(resultData.body.total_games / 12)
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

function MapToBoardGame(g: any): IBoardGame {
    return {
        id: g.id,
        name: g.name,
        description: g.description,
        year_published: g.year_published,
        min_players: g.min_players,
        max_players: g.max_players,
        min_age: g.min_age,
        min_playtime: g.min_play_time,   // snake_case → camelCase
        max_playtime: g.max_play_time,   // snake_case → camelCase
        playtime: g.playing_time,        // snake_case → camelCase
        thumbnail: g.thumbnail,
        url: g.url,
        price: g.price,
        BGG_score: g.bayes_average_user_score,
        users_rated: g.users_rate,
        average_user_score: g.average_user_score,
        rank: g.game_rank,
        store_page_rating: g.store_page_rating,
        implementations: [], // API doesn’t provide, default empty
        expansions: [],       // API doesn’t provide, default empty
        family: [],           // API doesn’t provide, default empty
        mechanics: [],        // API doesn’t provide, default empty
        categories: [],       // API doesn’t provide, default empty
        owned: Boolean(g.owned),
        quantity: g.quantity ?? 0,
    };
}