const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();

module.exports = (fieldName = 'image') => multer({ storage: inMemoryStorage }).single(fieldName);