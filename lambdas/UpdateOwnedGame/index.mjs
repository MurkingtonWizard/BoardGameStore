import { createPool, checkToken } from '/opt/nodejs/db/pool.mjs';

export const handler = async (event) => {
  let pool; 
  try { pool = await createPool(); } 
  catch (error) { 
      console.error("Failed to create MySQL Pool. Error: " + JSON.stringify(error)); 
      return { statusCode: 500, error: "Could not make database connection" }; 
  } 

  const addBoardGameOwned = async (email, gameId) => {
    let insertQuery = `INSERT INTO Owned (fk_email, fk_board_game_id, quantity) VALUES(?,?,1)`;
    return new Promise((resolve, reject) => {
      pool.query(insertQuery, [email, gameId], (err, rows) => {
        if (err) return reject(err); 
        resolve(rows); 
      }); 
    });
  }
  const removeBoardGameOwned = async (email, gameId) => {
    let removeQuery = `DELETE FROM Owned WHERE fk_email = ? AND fk_board_game_id = ?`;
    return new Promise((resolve, reject) => {
      pool.query(removeQuery, [email, gameId], (err, rows) => {
        if (err) return reject(err); 
        resolve(rows); 
      }); 
    });
  }

  let response;
  try {
    const account = await checkToken(event.token);
    if(event.update === "add") {
      await addBoardGameOwned(account.email, event.gameId);
    } else if (event.update === "remove") {
      await removeBoardGameOwned(account.email, event.gameId);
    } else {
      response = { statusCode: 400, error: `UpdateOwnedGame: No update action of ${event.update}` }; 
    }
    response = {
      statusCode: 200,
      body: {},
    };
  } catch (err) { 
    response = { statusCode: 400, error: err }; 
  } finally { pool.end(); } 
  return response; 
};