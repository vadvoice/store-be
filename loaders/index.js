const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');

module.exports = {
    init: async ({ expressApp }) => {
        const { db, gridBucket, gfsStorage } = await mongooseLoader();
        console.info('MongoDB Intialized');
        await expressLoader({ app: expressApp, db, gridBucket, gfsStorage });
        console.info('Express Intialized');
    }
};
