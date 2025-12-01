import { createPool } from '/opt/nodejs/db/pool.mjs'; 
import { generateToken } from '/opt/nodejs/db/pool.mjs';
import { checkToken } from '/opt/nodejs/db/pool.mjs';
import bcrypt from 'bcrypt';

export const handler = async (event) => {
    let pool; 
    try { pool = await createPool(); } 
    catch (error) { 
        console.error("Failed to create MySQL Pool. Error: " + JSON.stringify(error)); 
        return { statusCode: 500, error: "Could not make database connection" }; 
    } 

    let getAccount = async (email) => {
        let query = "SELECT * FROM Account WHERE email=LOWER(?)";
        let params = [email];
        return await new Promise((resolve, reject) => {
            pool.query(query, params, (err, results) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                if(results.length === 0) reject("No Account with that email address");
                resolve(results);
            });
        });
    }

    let response;

    try {
        let account = await getAccount(event.email);
        console.log(account[0]);
        console.log("test", account[0]);

        const validPass = await bcrypt.compare(event.password, account[0].password);

        if (!validPass) throw new Error("Invalid Password");
        
        let token = await generateToken(account[0]);
        console.log("tokenTest", token);

        response = {
            statusCode: 200,
            body: {
                token: token
            }
        }
    }
    catch (err) {
        console.log(err);
        response = {
            statusCode: 400,
            error: err
        }
    }

    finally {
        pool.end();
    }

    return response;
};
