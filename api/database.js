import pg from 'pg';
const { Client } = pg;

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'ECE496',
    port: 5432,
    database: 'HealthChainON',
});

export default client;