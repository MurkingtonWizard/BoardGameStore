import { createPool, checkToken } from '/opt/nodejs/db/pool.mjs';

export const handler = async (event) => {
  let pool; 
  try { pool = await createPool(); } 
  catch (error) { 
      console.error("Failed to create MySQL Pool. Error: " + JSON.stringify(error)); 
      return { statusCode: 500, error: "Could not make database connection" }; 
  } 

  const GetOrderHistory = async (email) => {
    let orderHistoryQuery = `
      SELECT
        t.id,
        t.date_time,
        t.total,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', tl.fk_board_game_id,
                'name', bg.name,
                'price', bg.price,
                'quantity', tl.quantity,
                'returned_quantity', COALESCE(r.total_returned, 0)
            )
        ) AS items
    FROM BG_Transaction t
    LEFT JOIN TransLines tl ON tl.fk_transaction_id = t.id
    LEFT JOIN BoardGame bg ON bg.id = tl.fk_board_game_id
    LEFT JOIN (
        SELECT fk_transaction_id, fk_board_game_id, SUM(quantity) AS total_returned
        FROM BG_Return
        GROUP BY fk_transaction_id, fk_board_game_id
    ) r ON r.fk_transaction_id = tl.fk_transaction_id
      AND r.fk_board_game_id = tl.fk_board_game_id
    WHERE t.fk_account_email = ?
    GROUP BY t.id, t.date_time, t.total
    ORDER BY t.date_time DESC;`;
    return new Promise((resolve, reject) => {
      pool.query(orderHistoryQuery, [email], (err, rows) => {
        if (err) return reject(err);
        console.log(rows);
        const transactions = rows.map(r => ({
          id: r.id,
          date_time: r.date_time,
          total: r.total,
          items: JSON.parse(r.items)
        }));

        resolve(transactions);
      }); 
    });
  }

  let response;
  try {
    const account = await checkToken(event.token);
    if(account === null ) throw Error("No valid token")
    const orders = await GetOrderHistory(account.email)
    console.log(orders);
    response = {
      statusCode: 200,
      body: orders,
    };
  } catch (err) { 
    response = { statusCode: 400, error: err }; 
  } finally { pool.end(); } 
  return response; 
};