const jwt = require('jsonwebtoken');
const db = require('./database');

// Middleware to authenticate the user
const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(400).json({ message: 'Invalid token.' });
    req.userId = decoded.id;  // Attach user ID to the request object
    next();
  });
};

// Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
  db.query('SELECT role FROM users WHERE id = ?', [req.userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error checking role' });
    
    const user = results[0];
    if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied. Not an admin.' });
    
    next();
  });
};

module.exports = { authenticateUser, checkAdmin };