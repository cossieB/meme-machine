import mysql from 'mysql2/promise';

export default async function() {
    const connection = await mysql.createConnection({host: 'localhost', user: 'Node', database: 'next'})
    
}