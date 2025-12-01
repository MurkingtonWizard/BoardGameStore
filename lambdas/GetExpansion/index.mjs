import { createPool } from '/opt/nodejs/db/pool.mjs';

export const handler = async (event) => {
  let pool;

  try {
    pool = await createPool();
  } catch (error) {
    console.error("Failed to create MySQL pool:", JSON.stringify(error));
    return { statusCode: 500, body: "DB connection failed" };
  }

  let body;

try {
  if (typeof event.body === "string") {
    body = JSON.parse(event.body);
  } else if (typeof event.body === "object") {
    body = event.body;
  } else if (event.gameId) {
    body = event;
  } else {
    throw new Error("Invalid event format");
  }
} catch (err) {
  console.error("Invalid input format:", event);
  return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body" }) };
}

  const { gameId } = body;
  if (!gameId) {
    return { statusCode: 400, body: "gameId required" };
  }

  const query = (sql, params) =>
    new Promise((resolve, reject) => {
      pool.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

  try {
    const parentRows = await query(
      `SELECT fk_parent_board_game_id AS parentId
       FROM Implementation 
       WHERE fk_child_board_game_id = ?`,
      [gameId]
    );

    let parentGame = null;
    if (parentRows.length > 0) {
      const parentId = parentRows[0].parentId;
      const parentDetails = await query(
        `SELECT * FROM BoardGame WHERE id = ?`,
        [parentId]
      );
      parentGame = parentDetails[0];
    }
    const childRows = await query(
      `SELECT fk_child_board_game_id AS childId
       FROM Implementation 
       WHERE fk_parent_board_game_id = ?`,
      [gameId]
    );

    let childGames = [];
    if (childRows.length > 0) {
      const childIds = childRows.map((r) => r.childId);
      const placeholders = childIds.map(() => "?").join(",");
      const details = await query(
        `SELECT * 
         FROM BoardGame
         WHERE id IN (${placeholders})`,
        childIds
      );
      childGames = details;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        parent: parentGame,
        children: childGames,
      }),
    };

  } catch (e) {
    console.error("Error:", e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch implementations" }),
    };
  }
};
