import mysql from 'mysql';

export async function createPool() {
    console.log('Creating MySQL pool...');
    var pool = mysql.createPool({
        host: "bg-database-1.cp8q6wocsf79.us-east-2.rds.amazonaws.com",
        user: "admin",
        password: "dQxEzTvkf7ymJXKmHoe1",
        database: "bg-database-1"
    });
    return pool;
}