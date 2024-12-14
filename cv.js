const multer = require('multer');
const path = require('path');

// Configure storage for CV uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/cvs');  // Save files in "uploads/cvs" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Add timestamp to filename
  }
});

const uploadCV = multer({ storage: storage });
  
module.exports = { uploadCV };
