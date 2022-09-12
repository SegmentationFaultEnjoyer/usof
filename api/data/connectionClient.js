const { Client } = require('pg');

const client = new Client({ connectionString: process.env.DB_URL })

const connect = async () => {
    try {
        await client.connect();
        console.log('Connected to DB');
    } catch (error) {
        console.error(error.message);
        console.log('DB CONNECTION ERROR');
    }


}
connect();

module.exports = client;