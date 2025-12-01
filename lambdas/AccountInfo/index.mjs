import { createPool, checkToken } from "/opt/nodejs/db/pool.mjs";

export const handler = async (event) => {
  let pool;

  try {
    pool = await createPool();
  } catch (error) {
    console.error("Failed to create MySQL Pool:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "DB connection failed" }) };
  }

  const getAccount = async (email) => {
    const query = "SELECT email, username, funds FROM Account WHERE email = LOWER(?)";
    return new Promise((resolve, reject) => {
      pool.query(query, [email], (err, rows) => {
        if (err) return reject(err);
        if (rows.length === 0) return reject("Account not found");
        resolve(rows[0]);
      });
    });
  };

  try {
    const decoded = await checkToken(event.token);
    const info = await getAccount(decoded.email);

    return {
      statusCode: 200,
      body: info
    };

  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Could not fetch account info" })
    };
  } finally {
    pool.end();
  }
};
