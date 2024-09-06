import express from 'express';
import { getLoginForm, login, logout, getCurrentUser } from '../controllers/authController.js';
import { getRegistrationForm, register } from '../controllers/regController.js';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/user.js';

const router = express.Router();

// Public routes
router.get('/', (req, res) => {
    res.send('Welcome to the Express.js authentication system');
});

router.get('/login', getLoginForm);
router.post('/login', login);

router.get('/register', getRegistrationForm);
router.post('/register', register);

// Protected routes
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getCurrentUser);
router.post('/delete-account', authenticateToken, async (req, res) => {
    try {
        const deletedUser = await User.deleteAccount(req.userId);
        res.json({ message: 'Account deleted successfully', user: deletedUser });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'An error occurred while deleting the account' });
    }
});

export default router;