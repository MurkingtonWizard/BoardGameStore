import { createPool, checkToken } from '/opt/nodejs/db/pool.mjs';

export const handler = async (event) => {
  let pool; 
  try { pool = await createPool(); } 
  catch (error) { 
      console.error("Failed to create MySQL Pool. Error: " + JSON.stringify(error)); 
      return { statusCode: 500, error: "Could not make database connection" }; 
  } 

  const createReturn = async(boardGame, quantity, transaction) => {
    const returnQuery = `INSERT INTO BG_Return (fk_board_game_id, date_time, quantity, fk_transaction_id) VALUES (?, NOW(), ?, ?)`;
    const params = [boardGame, quantity, transaction];
    return new Promise((resolve, reject) => {
      pool.query(returnQuery, params, (err, rows) => {
        if (err) return reject(err); 
        resolve(rows.insertId); 
      }); 
    });
  }

  let response;
  try {
    const account = await checkToken(event.token);
    console.log("test!");

    let BG_Returns = [];
    for (let i = 0; i < event.transactions.length; i++) {
      console.log("test!");
      const t = event.transactions[i];
      BG_Returns.push(await createReturn(t.boardGameID, t.quantity, t.transaction_id));
    }

    response = {
      statusCode: 200,
      body: BG_Returns
    };
  } catch (err) { 
    response = { statusCode: 400, error: err }; 
  } finally { pool.end(); } 
  return response; 
};