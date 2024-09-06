import { verifyToken } from '../utils/jwtUtils.js';


export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Verify the token
        const decoded = verifyToken(token);
        
        if (!decoded) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        // If verification is successful, save the user data in the request object
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(403).json({ error: 'Invalid token' });
    }
};
