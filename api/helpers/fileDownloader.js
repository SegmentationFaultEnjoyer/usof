const multer = require('multer');
const { join } = require('path');

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, join(__dirname, '..', 'user_data'));
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

const downloadSingle = multer({storage: storageConfig}).single('img');

const downloadMultiple = multer({storage: storageConfig}).array('img');

module.exports = { downloadSingle, downloadMultiple };