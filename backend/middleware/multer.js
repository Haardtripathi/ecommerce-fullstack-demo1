// middlewares/multer.js
const multer = require('multer');
const path = require('path');

// Set storage destination and filename
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Filter files (accept only images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Images only!'));
    }
};

// Set the multer configuration
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Max file size: 5MB
});

module.exports = upload;
