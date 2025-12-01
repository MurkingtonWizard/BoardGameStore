import { createPool, checkToken } from '/opt/nodejs/db/pool.mjs';

export const handler = async (event) => {
  let pool; 
  try { pool = await createPool(); } 
  catch (error) { 
      console.error("Failed to create MySQL Pool. Error: " + JSON.stringify(error)); 
      return { statusCode: 500, error: "Could not make database connection" }; 
  } 

  const getTransactions = async (email) => {
    let transactionQuery = `SELECT bg.*, tl.quantity, FALSE AS owned
    FROM BG_Transaction t
    JOIN TransLines tl ON t.id = tl.fk_transaction_id
    JOIN BoardGame bg ON tl.fk_board_game_id = bg.id
    WHERE t.fk_account_email = ?`;
    return new Promise((resolve, reject) => {
      pool.query(transactionQuery, [email], (err, rows) => {
        if (err) return reject(err);
        resolve(rows); 
      }); 
    });
  }

  let getOwned = async (email) => {
    // Just Owned Games so far
    const ownedQuery = `SELECT b.*, TRUE AS owned, 0 AS quantity
                          FROM BoardGame b
                          JOIN Owned o ON b.id = o.fk_board_game_id
                          WHERE o.fk_email = ?;
    `;
    return new Promise((resolve, reject) => {
      pool.query(ownedQuery, [email], (err, rows) => {
        if (err) return reject(err); 
        resolve(rows); 
      }); 
    });
  }

  const mergeBoardGames = (transactions, owned) => {
    const gameMap = new Map();

    transactions.forEach(game => {
      gameMap.set(game.id, { ...game });
    });
    
    owned.forEach(game => {
      if (gameMap.has(game.id)) {
        const existing = gameMap.get(game.id);
        gameMap.set(game.id, {
          ...existing,
          quantity: Math.max(existing.quantity || 0, game.quantity || 0),
          owned: Math.max(existing.owned ? 1 : 0, game.owned ? 1 : 0), // convert boolean to 0/1 max
        });
      } else {
        gameMap.set(game.id, { ...game });
      }
    });

    return Array.from(gameMap.values());
  }

  let response;
  try {
    const account = await checkToken(event.token);
    const transactions = await getTransactions(account.email);
    const owned = await getOwned(account.email);
    const libraryGames = mergeBoardGames(transactions, owned);
    response = {
      statusCode: 200,
      body: {
        games: libraryGames,
      }
    };
  } catch (err) { 
    response = { statusCode: 400, error: err }; 
  } finally { pool.end(); } 
  return response; 
};