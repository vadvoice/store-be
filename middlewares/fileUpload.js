const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();

module.exports = (fieldName = 'image', gallery = 'gallery') => multer({ storage: inMemoryStorage })
   .fields([{name: fieldName, maxCount: 1}, {name: gallery, maxCount: 5}]);
