import { createPool } from '/opt/nodejs/db/pool.mjs';

export const handler = async (event) => {
  let pool; 
  try { pool = await createPool(); } 
  catch (error) { 
      console.error("Failed to create MySQL Pool. Error: " + JSON.stringify(error)); 
      return { statusCode: 500, error: "Could not make database connection" }; 
  } 


  let response;
  try {
    response = {
      statusCode: 200,
      body: JSON.stringify('Hello from Lambda!'),
    };
  } catch (err) { 
    response = { statusCode: 400, error: err }; 
  } finally { pool.end(); } 
  return response; 
};