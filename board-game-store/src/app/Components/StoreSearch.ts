import { IBoardGame } from "@/model";

export type Filters = {
  minAge: number; maxAge: number;
  minPlayers: number; maxPlayers: number;
  minYear: number; maxYear: number;
  minPlaytime: number; maxPlaytime: number;
  minBGGScore: number; maxBGGScore: number;
  minStoreScore: number; maxStoreScore: number;
};

export const FetchStoreData = async (search: string, filters: Filters, page: number): Promise<IBoardGame[]> => {
    const payload = {
        search,
        filters,
        page,
    };
    console.log("Searching for:", payload);
    try {
        const response = await fetch('https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/SearchAndFilter',
        {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        const resultData = await response.json();
        console.log(resultData);
        if(resultData.statusCode == 200) {
            console.log(resultData.body);
            return resultData.body as IBoardGame[];
        }
        return [];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
