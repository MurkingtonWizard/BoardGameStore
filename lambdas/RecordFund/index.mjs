import { createPool, checkToken } from '/opt/nodejs/db/pool.mjs';

export const handler = async (event) => {
  let pool;

  try {
    pool = await createPool();
  } catch (error) {
      console.error("Failed to create MySQL Pool. Error: " + JSON.stringify(error));
      return { statusCode: 500, error: "Could not make database connection" };  
  }

  const addAccountFunds = async (email,funds) => {
    let addfundsquery = `
    INSERT INTO FundRecord (fk_email, amount, date_time)
    VALUES (?, ?, NOW())
  `;
  console.log(addfundsquery)
    
    return new Promise((resolve, reject) => {
      pool.query(addfundsquery, [email, funds], (err, rows) => {
          if (err) return reject(err);
          console.log(rows)
          return resolve(rows);
        });
      });
    }
let response; 
try {
    const account = await checkToken(event.token);
    console.log(account)
    const result = await addAccountFunds(account.email, event.amount);
    console.log(result)
    response = {
      statusCode: 200,
      body: JSON.stringify({ message: "Funds added successfully" }),
    };
  } catch (error) {
    console.error("Error adding funds:", error);
    response = {
      statusCode: 400,
      body: JSON.stringify({ error: "Could not add funds" }),
    };
  } finally {
      pool.end();
  }

  return response;
};





