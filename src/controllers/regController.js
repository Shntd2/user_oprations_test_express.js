import User from '../models/user.js';
import { generateToken } from '../utils/jwtUtils.js';


export const getRegistrationForm = (req, res) => {
    console.log('GET /register - Serving registration form');
    res.send(`
        <form method="POST" action="/auth/register">
            <input type="text" name="username" placeholder="Username" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Register</button>
        </form>
    `);
};

export const register = async (req, res) => {
    const { username, password } = req.body;
    console.log(`POST /register - Registering user: ${username}`);

    try {
        const newUser = await User.create(username, email, password);
        const token = generateToken(newUser.id);
        console.log(`Registration successful for ${username}`);
        res.status(201).json({
            message: 'Registration successful',
            user: { id: newUser.id, username: newUser.username },
            token: token
        });
    } catch (error) {
        console.error('Registration error:', error.message);
        if (error.message === 'Username already exists') {
            return res.status(400).json({ error: 'Username already exists' });
        }
        if (error.message === 'Email already exists') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'An error occurred during registration' });
    }
};
