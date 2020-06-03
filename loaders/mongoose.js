const mongoose = require('mongoose');

const { databaseConfig } = require('../config');

module.exports = async () => {
  try {
    const connection = await mongoose.connect(databaseConfig.mongoUri, { useUnifiedTopology: true, useNewUrlParser: true });
    const gridBucket = new mongoose.mongo.GridFSBucket(
      connection.connection.db,
      {
        bucketName: databaseConfig.filesCollection
      }
    );

    return {
      db: connection.connection.db,
      gridBucket
    };
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
