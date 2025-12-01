import { createPool, checkToken } from '/opt/nodejs/db/pool.mjs';

export const handler = async (event) => {
  let pool;
  try {
    pool = await createPool();
  } catch (error) {
    console.error("Failed to create MySQL Pool:", JSON.stringify(error));
    return { statusCode: 500, error: "Could not make database connection" };
  }

  const addOrUpdateRating = async (email, gameId, number_rating, text) => {
    const query = `
      INSERT INTO Rating (fk_email, fk_board_game_id, number_rating, text)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        number_rating = COALESCE(VALUES(number_rating), number_rating),
        text = IF(VALUES(text) IS NULL OR VALUES(text) = '', text, VALUES(text));

    `;
    const params = [email.toLowerCase(), gameId, number_rating, text];
    return new Promise((resolve, reject) => {
      pool.query(query, params, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };

  const getGameRatings = async (gameId) => {
    const query = `
      SELECT r.fk_email AS email, a.username, r.number_rating, r.text
      FROM Rating r
      JOIN Account a ON r.fk_email = a.email
      WHERE r.fk_board_game_id = ?
      ORDER BY r.number_rating DESC;
    `;
    return new Promise((resolve, reject) => {
      pool.query(query, [gameId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  };

  const getUserRating = async (email, gameId) => {
    const query = `
      SELECT number_rating, text
      FROM Rating
      WHERE fk_email = ? AND fk_board_game_id = ?;
    `;
    return new Promise((resolve, reject) => {
      pool.query(query, [email.toLowerCase(), gameId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  };

  let response;
  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event;
    const { action, gameId, number_rating, text } = body;
    // gameId is int
    const gameIdInt = parseInt(gameId);

    let userEmail = null;
    if (action !== "getGameRatings") {
      const token = body.token;
      if (!token) throw new Error("Missing token");
      const account = await checkToken(token);
      console.log("Decoded account:", account);
      userEmail = account.email.toLowerCase();
    }

    if (action === "createOrUpdate") {
      // reuse rating if only text was submitted
      let effectiveRating = number_rating;

      if (effectiveRating === null || effectiveRating === undefined) {
        const existing = await getUserRating(userEmail, gameIdInt);
        console.log("DEBUG getUserRating ->", {
          email: userEmail,
          gameIdInt,
          existingLength: existing.length,
          existingData: existing
        });
        if (existing.length > 0 && existing[0].number_rating !== null) {
          effectiveRating = existing[0].number_rating;
        } else {
          throw new Error("Missing valid rating (1–5). Submit a rating first.");
        }
      }
    
      const normalizedText = text && text.trim() !== "" ? text.trim() : null;
      await addOrUpdateRating(userEmail, gameIdInt, effectiveRating, normalizedText);

      response = {
        statusCode: 200,
        body: { message: "Rating and review saved successfully." },
      };
    }

    else if (action === "getUserRating") {
      const result = await getUserRating(userEmail, gameIdInt);
      response = { statusCode: 200, body: result[0] || {} };
    }

    else if (action === "getGameRatings") {
      const result = await getGameRatings(gameIdInt);
      response = { statusCode: 200, body: { ratings: result, total: result.length } };
    }

    else if (action === "deleteReview") {
      const query = `
        DELETE FROM Rating
        WHERE fk_email = ? AND fk_board_game_id = ?;
      `;
      await new Promise((resolve, reject) => {
        pool.query(query, [userEmail, gameIdInt], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
      response = { statusCode: 200, body: { message: "Review deleted successfully" } };
    }

    else {
      response = { statusCode: 400, error: "Invalid action type." };
    }
  } catch (err) {
    console.error("Ratings Lambda Error:", err);
    response = { statusCode: 500, error: err.message || err };
  } finally {
    if (pool) pool.end();
  }

  return response;
};
