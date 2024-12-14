require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3006;

const db = require('./database');
const { authenticateUser, checkAdmin } = require('./auth');
const { uploadCV } = require('./cv');
const { savePersonalityForm } = require('./personality');
const { adminFunctions } = require('./admin');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authenticateUser);

// Register route
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "user")', [name, email, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error registering user:', err);  // Log the error for better debugging
            return res.status(500).json({ message: 'Error registering user' });
        }
        res.status(200).json({ message: 'User registered successfully' });  // Success message
    });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error logging in:', err);  // Log the error for debugging
            return res.status(500).json({ message: 'Error logging in' });
        }
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = results[0];
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    });
});

// Upload CV route
app.post('/uploadCV', authenticateUser, uploadCV.single('cv'), (req, res) => {
    const userId = req.userId;
    const filePath = req.file.path;

    db.query('INSERT INTO cvs (user_id, file_path) VALUES (?, ?)', [userId, filePath], (err, result) => {
        if (err) {
            console.error('Error uploading CV:', err);  // Log the error for debugging
            return res.status(500).json({ message: 'Error uploading CV' });
        }
        res.status(200).json({ message: 'CV uploaded successfully' });
    });
});

// Submit personality form route
app.post('/submitPersonalityForm', (req, res) => {
    const { question1, question2, question3, question4, question5, question6, question7, question8, question9, question10, question11, question12 } = req.body;

    db.query('INSERT INTO personality_forms (user_id, question1, question2, question3, question4, question5, question6, question7, question8, question9, question10, question11, question12) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [req.userId, question1, question2, question3, question4, question5, question6, question7, question8, question9, question10, question11, question12], 
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Error submitting personality form' });
        res.status(200).json({ message: 'Personality form submitted successfully' });
    });
});

// Admin routes
app.get('/admin/users', checkAdmin, (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err); 
            return res.status(500).json({ message: 'Error fetching users' });
        }
        res.status(200).json({ users: results });
    });
});

// Admin email functionality to contact users
app.post('/admin/contactUser', checkAdmin, (req, res) => {
    const { userId, subject, message } = req.body;

    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching user' });

        const user = results[0];
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,  
                pass: process.env.EMAIL_PASSWORD,  
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: subject,
            text: message
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) return res.status(500).json({ message: 'Error sending email' });
            res.status(200).json({ message: 'Email sent successfully' });
        });
    });
});

// Start the server
app.listen(process.env.PORT || 3006, () => {
    console.log('Server is running on port ${process.env.PORT || 3006}');
});