const multer = require('multer');
const path = require('path');

// Set up file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/resumes');
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // safer than split('.')
    cb(null, `${Date.now()}${fileExtension}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /pdf|docx|jpeg|jpg|gif/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedExtensions.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Please upload PDF, DOCX, or image files.'));
  }
};

// Set up multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// Middleware wrapper that catches Multer errors
const uploadResume = (req, res, next) => {
  upload.single('resumeFile')(req, res, (err) => {
    if (err instanceof multer.MulterError || err?.message.includes('Unsupported file type')) {
      req.uploadError = err.message;
      return next(); // still go to the route
    } else if (err) {
      req.uploadError = 'File upload failed.';
      return next();
    }
    next(); // success case
  });
};

module.exports = uploadResume;
