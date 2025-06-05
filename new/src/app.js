const express = require('express');
const app = express();
const actionsRouterUser = require('./routes/user');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./DBConfig/db');
const authMiddleware = require('./middlewares/authMiddleware'); 
require('dotenv').config();

connectDB();

app.use(express.json()); // parse JSON bodies first

app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use('/api/userActions', actionsRouterUser);

app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: `Welcome, ${req.user.name}. You are authenticated.` });
});

// Consistent cookie name and options for logout
app.post('/api/userActions/logout', (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/', (req, res) => {
    res.send("Welcome to the simple API example!");
});

app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong" });
});

module.exports = app;
