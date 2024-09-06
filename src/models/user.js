import { query } from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/hashUtils.js';
import AccountManager from './accountManager.js';
import { generateToken } from '../utils/jwtUtils.js';


class User {
    static async findByCredentials(username, password) {
        try {
            const res = await query('SELECT * FROM users WHERE username = $1', [username]);
            const user = res.rows[0];
            if (user && await comparePassword(password, user.password)) {
                const token = generateToken(user.id);
                return { user, token };
            }
            return null;
        } catch (error) {
            console.error('Error in finding user credentials:', error.message);
            throw error;
        }
    }

    static async getNextAvailableId() {
        try{
            const res = await query('SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM users');
            return res.rows[0].next_id;
        } catch (error) {
            console.error('Error getting next available ID:', error.message);
            throw error;
        }
    }

    static async create(username, email, password) {
        try {
            const hashedPassword = await hashPassword(password);
            const nextId = await this.getNextAvailableId();
            const res = await query('INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *', [nextId, username, email, hashedPassword]);
            return res.rows[0];
        } catch (error) {
            console.error('Error in create:', error.message);
            if (error.code === '23505') { // Unique violation error code
                if (error.constraint.includes('username')) {
                    throw new Error('Username already exists');
                } else if (error.constraint.includes('email')) {
                    throw new Error('Email already exists');
                }
            }
            throw error;
        }
    }

    static async deleteAccount(userId) {
        return AccountManager.deleteAccount(userId);
    }
}

export default User;
