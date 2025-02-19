const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL, // Use environment variables for security
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err));

module.exports = client;
