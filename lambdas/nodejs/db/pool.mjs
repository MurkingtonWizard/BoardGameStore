import mysql from 'mysql';
import jwt from 'jsonwebtoken';

const JWT_KEY = `${process.env.WEB_TOKEN_KEY}`;

export async function createPool() {
    console.log('Creating MySQL pool...');
    var pool = mysql.createPool({
        host: "bg-database-1.cp8q6wocsf79.us-east-2.rds.amazonaws.com",
        user: "admin",
        password: "dQxEzTvkf7ymJXKmHoe1",
        database: "bg-database"
    });
    return pool;
}

export async function generateToken(account) {
	const payload = {
		username: account.username,
		email: account.email,
		loggedIn: true	
	};
	
	return new Promise(async (resolve, reject) => {
		if (!account) reject ("account undefined");
		return jwt.sign(payload, JWT_KEY, { expiresIn: '24h' }, (err, token) => {
			if (err) return reject(err);
			return resolve(token);
		});
	});
		
}

export async function checkToken(token) {
	return new Promise((resolve, reject) => {
		if (token === undefined || token == null) return reject(new jwt.TokenExpiredError());

		return jwt.verify(token, JWT_KEY, (err, decoded) => {
			if (err) {
				console.error(err);
				return reject (err);
			}

			if (decoded.exp < Date.now() / 1000) {
				return reject("expired token");
			}

			return resolve({ username: decoded.username, email: decoded.email, loggedIn: true });
		});
	});
}
