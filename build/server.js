import express from 'express';
import { URL } from 'url';
import path from 'path';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
const __filename = new URL('', import.meta.url).pathname;
const __dirname = new URL('.', import.meta.url).pathname;
const users = [
    { id: 1, username: 'admin', password: 'admin' },
    { id: 2, username: 'user', password: 'user' },
];
const secretKey = 'secret';
console.log('import.meta.url:', import.meta.url);
console.log('URL:', new URL('', import.meta.url));
console.log('pathname:', new URL('', import.meta.url).pathname);
console.log('dirname:', __dirname);
console.log('filename:', __filename);
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.get('/api/dashboard', (req, res) => {
    res.json({
        success: true,
        message: 'Dashboard data',
    });
});
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            err: err.message,
        });
    }
    else {
        next(err);
    }
});
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    console.log('username:', username);
    console.log('password:', password);
    for (const user of users) {
        if (user.username === username && user.password === password) {
            const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
            return res.json({
                success: true,
                err: null,
                tokenValue: token,
            });
        }
        else {
            return res.status(401).json({
                success: false,
                tokenValue: null,
                err: 'Username or password is incorrect',
            });
        }
    }
});
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
