import pg from 'pg';
import { setTimeout } from 'timers/promises';


const { Pool } = pg;

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

let pool;

const createPool = () => {
    return new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'reg_data_expressjs_test',
        password: '2233',
        port: 5440
    });
};

const connectWithRetry = async (retries = MAX_RETRIES) => {
    try {
        pool = createPool();
        await pool.query('SELECT NOW()');
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error.message);
        if (retries > 0) {
            console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
            await setTimeout(RETRY_DELAY);
            await connectWithRetry(retries - 1);
        } else {
            console.error('Max retries reached. Unable to connect to the database.');
            throw error;
        }
    }
};

export const query = async (text, params) => {
    if (!pool) {
        await connectWithRetry();
    }
    try {
        return await pool.query(text, params);
    } catch (error) {
        console.error('Database query error:', error.message);
        throw error;
    }
};

export const createUsersTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `;
    try {
        await query(createTableQuery);
        console.log('Users table created or already exists');
    } catch (error) {
        console.error('Error creating users table:', error.message);
        throw error;
    }
};

// Initialize the connection
connectWithRetry().catch(error => {
    console.error('Failed to establish initial database connection:', error.message);
    process.exit(1);
});
