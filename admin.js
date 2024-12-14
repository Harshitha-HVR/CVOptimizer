const nodemailer = require('nodemailer');

// Admin function to contact users by email
const adminFunctions = (req, res) => {
  const { userId, subject, message } = req.body;
  
  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching user' });
    
    const user = results[0];
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'youremail@gmail.com',
        pass: 'yourpassword',
      }
    });

    const mailOptions = {
      from: 'youremail@gmail.com',
      to: user.email,
      subject: subject,
      text: message
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return res.status(500).json({ message: 'Error sending email' });
      res.status(200).json({ message: 'Email sent successfully' });
    });
  });
};

module.exports = { adminFunctions };
