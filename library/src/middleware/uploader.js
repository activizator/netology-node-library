const multer = require('multer');

const storage = multer.diskStorage({
    destination (req, file, cb) {
        cb(null, 'books');
    },
    filename (req, file, cb) {
        const { id } = req.params;
        cb(null, `${id}.txt`);
    }
});

const allowedTypes = ['text/plain'];

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

module.exports = multer({
    storage, fileFilter
});
