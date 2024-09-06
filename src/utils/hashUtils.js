import bcrypt from 'bcrypt';


const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
        console.error('Error in hashing password:', error.message);
        throw error;
    }
};

export const comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Error in comparing password:', error.message);
        throw error;
    }
};
