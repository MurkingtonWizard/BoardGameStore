import { IBoardGame } from "@/model/BoardGame";

export const FetchReimplementations = async (
  gameId: number
): Promise<{ parent: IBoardGame | null; children: IBoardGame[] }> => {
  try {
    const response = await fetch(
      "https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/getImplementation",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId }),
      }
    );

    const raw = await response.json();

    if (!raw || typeof raw.body !== "string") {
      return { parent: null, children: [] };
    }

    const parsed = JSON.parse(raw.body);

    return {
      parent: parsed.parent ?? null,
      children: parsed.children ?? [],
    };
  } catch (err) {
    console.error("FetchReimplementations error:", err);
    return { parent: null, children: [] };
  }
};

export const FetchGameRatings = async (
  gameId: number
): Promise<{ average: number | null; ratings: any[] }> => {
  try {
    const response = await fetch(
      "https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/Ratings",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getGameRatings",
          gameId,
        }),
      }
    );

    const result = await response.json();

    if (result.statusCode !== 200 || !result.body?.ratings) {
      return { average: null, ratings: [] };
    }

    const ratings = result.body.ratings;

    if (ratings.length === 0) {
      return { average: null, ratings: [] };
    }

    const avg =
      ratings.reduce((sum: number, r: any) => sum + (r.number_rating || 0), 0) /
      ratings.length;

    return {
      average: Number(avg.toFixed(1)),
      ratings,
    };
  } catch (err) {
    console.error("FetchGameRatings error:", err);
    return {
      average: null,
      ratings: [],
    };
  }
};

