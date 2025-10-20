export interface IBoardGame {
    id: string,
    name: string,
    description: string,
    year_published: number,
    min_players: number,
    max_players: number,
    min_age: number,
    min_playtime: number,
    max_playtime: number,
    playtime: number,
    thumbnail: string,
    url: string,
    price: number,
    BGG_score: number, // bayes score
    users_rated: number,
    average_user_score: number,
    rank: number,
    store_page_rating: number,
    implementations: number[], // list of ids
    expansions: number[], // list of ids
    family: string[],
    mechanics: string[],
    categories: string[]
}

