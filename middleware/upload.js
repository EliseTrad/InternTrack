const multer = require('multer');
const path = require('path');

// Set up file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/users'); // Folder for profile pictures
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, `${Date.now()}${fileExtension}`);
  },
});

// File filter: only images allowed
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedExtensions.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Please upload an image (JPG, PNG, or GIF).'));
  }
};

// Set up multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB for profile pictures
});

// Middleware wrapper to catch Multer errors
const uploadProfilePicture = (req, res, next) => {
  upload.single('profile_picture')(req, res, (err) => {
    if (err instanceof multer.MulterError || err?.message.includes('Unsupported file type')) {
      req.uploadError = err.message;
      return next();
    } else if (err) {
      req.uploadError = 'Profile picture upload failed.';
      return next();
    }
    next(); // success
  });
};

module.exports = uploadProfilePicture;
