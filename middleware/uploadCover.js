const multer = require('multer');

// Set up file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/covers'); //  where uploaded files will go
  },
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${fileExtension}`); // Set the filename as the current timestamp
  },
});

// Set file filter (you can restrict file types here)
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /pdf|docx|jpeg|jpg|gif/;
  const mimeType = allowedFileTypes.test(file.mimetype);
  const extname = allowedFileTypes.test(file.originalname.split('.').pop());

  if (mimeType && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Please upload PDF, DOCX, or image files.'));
  }
};

// Initialize multer with the storage and fileFilter configuration
const uploadCover = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

module.exports = uploadCover;
