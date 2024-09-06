import { query } from '../config/database.js';


class AccountManager {
    static async deleteAccount(userId) {
        try{
            // Delete the user from the database
            const res = await query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
            if (res.rowCount === 0) {
                throw new Error('User not found');
            }

            console.log(`User ${userId} has been deleted successfully`);
            return res.rows[0];
        } catch (error) {
            console.error('Error deleting user:', error.message);
            throw error;
        }
    }
}

export default AccountManager;
