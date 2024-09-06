import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY;

if (!JWT_SECRET) {
    console.error('JWT_SECRET is not set in the environment variables');
    process.exit(1);
}

export const generateToken = (userId) => {
    try {
        return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    } catch (error) {
        console.error('Error generating token:', error.message);
        throw new Error('Failed to generate token');
    }
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.error('Token expired:', error.message);
        } else if (error instanceof jwt.JsonWebTokenError) {
            console.error('Invalid token:', error.message);
        } else {
            console.error('Error verifying token:', error.message);
        }
        return null;
    }
};