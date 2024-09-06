import User from '../models/user.js';


export const getLoginForm = (req, res) => {
    console.log('GET /login - Serving login form');
    res.send(`
        <form method="POST" action="/auth/login">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    `);
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    console.log(`POST /login - Logging in user: ${username}`);
    try {
        const result = await User.findByCredentials(username, password);

        if (result) {
            console.log(`Login successful for ${username}`);
            res.json({
                message: 'Login successful',
                user: { id: result.user.id, username: result.user.username },
                token: result.token
            });
        } else {
            console.log(`Login failed for ${username}`);
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'An error occurred during login' });
    }
};

export const logout = (req, res) => {
    console.log('POST /logout - User logged out');
    res.json({ message: 'Logout successful' });
};

export const getCurrentUser = (req, res) => {
    res.json({ user: { id: req.userId, username: req.username } });
};