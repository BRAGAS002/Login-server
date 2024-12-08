import express from 'express';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const db = new Database('users.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

// Middleware
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Routes
app.post('/register', (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    stmt.run(username, email, hashedPassword);
    
    res.redirect('/?success=registered');
  } catch (error) {
    res.redirect('/?error=registration-failed');
  }
});

app.post('/login', (req, res) => {
  try {
    const { username_or_email, password } = req.body;
    
    const stmt = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?');
    const user = stmt.get(username_or_email, username_or_email);
    
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.userId = user.id;
      res.redirect('/dashboard.html');
    } else {
      res.redirect('/?error=invalid-credentials');
    }
  } catch (error) {
    res.redirect('/?error=login-failed');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});