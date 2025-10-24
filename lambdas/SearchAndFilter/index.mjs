import { createPool } from '/opt/nodejs/db/pool.mjs';

export const handler = async (event) => {
  var pool = createPool();


  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};