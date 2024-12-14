const savePersonalityForm = (req, res) => {
    const { question1, question2, question3, question4, question5, question6, question7, question8, question9, question10, question11, question12 } = req.body;
  
    db.query('INSERT INTO personality_forms (user_id, question1, question2, question3, question4, question5, question6, question7, question8, question9, question10, question11, question12) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [req.userId, question1, question2, question3, question4, question5, question6, question7, question8, question9, question10, question11, question12], 
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Error submitting personality form' });
        res.status(200).json({ message: 'Personality form submitted successfully' });
    });
  };
  
  module.exports = { savePersonalityForm };