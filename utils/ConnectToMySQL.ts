import mysql from 'mysql2/promise';

export default async function() {
    return  mysql.createConnection({host: 'localhost', user: 'Node', database: 'next', password: '12345678'})

}