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

    let createAccount = async (email, username, password) => {
        let query = "INSERT INTO Account VALUES (?, ?, ?, ?)";
        let params = [email, username, password, 0];
        return await new Promise((resolve, reject) => {
            pool.query(query, params, (err, results) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                if(results.length === 0) reject("Error creating account. May already exist?");
                resolve(results);
            });
        });
    }

    let response;

    try {
        let password = await bcrypt.hash(event.password, 12);
        let newAccount = await createAccount(event.email, event.username, password);
        console.log(newAccount, newAccount[0]);
        console.log("test", newAccount);

        response = {
            statusCode: 200,
            body: {
                message: "account created"
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
