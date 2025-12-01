import { createPool, checkToken } from '/opt/nodejs/db/pool.mjs';

export const handler = async (event) => {
  let pool; 
  try { pool = await createPool(); } 
  catch (error) { 
      console.error("Failed to create MySQL Pool. Error: " + JSON.stringify(error)); 
      return { statusCode: 500, error: "Could not make database connection" }; 
  } 

  const getTotalCost = async (transactions) => {
    if (!transactions || transactions.length === 0) return 0;

    const ids = transactions.map(t => t.boardGameID).join(',');
    const countQuery = `SELECT COUNT(*) AS found FROM BoardGame WHERE id IN (${ids});`;

    const sumExpression = transactions
      .map(t => `WHEN id = ${t.boardGameID} THEN price * ${t.quantity}`)
      .join(' ');
  
    const costQuery = `
      SELECT SUM(
        CASE
          ${sumExpression}
        END
      ) AS total
      FROM BoardGame
      WHERE id IN (${transactions.map(t => t.boardGameID).join(',')});
    `;
  
    try { // Run both queries in parallel 
      const [_, totalCost] = await Promise.all([ 
        new Promise((resolve, reject) =>
          pool.query(countQuery, [], (err, rows) => {
            if (err) return rej(err);
            if (!rows || rows.length !== 1) return reject("Count query failed");
            const found = rows[0].found;
            if (found !== transactions.length) return reject("One or more board game IDs do not exist");
            resolve(found);
          })
        ),
        new Promise((resolve, reject) => {
          pool.query(costQuery, [], (err, rows) => {
            if (err) return reject(err); 
            if(rows.length !== 1) return reject("No Cost return");
            resolve(rows[0].total); 
          }); 
        })
      ]); 
      return totalCost; 
    } 
    catch (error) { 
        console.error("TotalCost error:", error); 
        return 0; 
    }
  }

  const getFunds = async (email) => {
    let fundsQuery = `SELECT funds FROM Account WHERE email=?`
    return new Promise((resolve, reject) => {
      pool.query(fundsQuery, [email], (err, rows) => {
        if (err) return reject(err); 
        if(rows.length !== 1) return reject("No funds");
        resolve(rows[0].funds); 
      }); 
    });
  }

  const createTransaction = async (email) => {
    let transactionQuery = `INSERT INTO BG_Transaction (fk_account_email, date_time, total)
      VALUES (?, NOW(), ?)`;
    return new Promise((resolve, reject) => {
      pool.query(transactionQuery, [email, 0], (err, rows) => {
        if (err) return reject(err); 
        resolve(rows.insertId); 
      }); 
    });
  }

  const createTransLines = async (transactionID, boardGameID, quantity) => {
    let transLineQuery = `INSERT INTO TransLines (fk_transaction_id, fk_board_game_id, quantity) VALUES (?, ?, ?)`;
      console.log("translines "+transactionID);
    return new Promise((resolve, reject) => {
      pool.query(transLineQuery, [transactionID, boardGameID, quantity], (err, rows) => {
        if (err) return reject(err); 
        resolve(rows); 
      }); 
    });
  }

  const getTransaction = async (transactionID) => {
    let transactionQuery = `SELECT * FROM BG_Transaction WHERE id=?`;
    return new Promise((resolve, reject) => {
      pool.query(transactionQuery, [transactionID], (err, rows) => {
        if (err) return reject(err);
        resolve(rows); 
      }); 
    });
  }

  let response;
  try {
    const account = await checkToken(event.token);
    const totalCost = await getTotalCost(event.transactions);
    const funds = await getFunds(account.email);
    if(funds < totalCost) {
      throw Error("Not enough funds");
    }

    const transactionID = await createTransaction(account.email);
    for (const t of event.transactions) {
      await createTransLines(transactionID, t.boardGameID, t.quantity);
    }
    const transaction = await getTransaction(transactionID);

    response = {
      statusCode: 200,
      body: transaction,
    };
  } catch (err) { 
    response = { statusCode: 400, error: err }; 
  } finally { pool.end(); } 
  return response; 
};