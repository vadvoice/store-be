const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const { appConfig } = require('../config');
 
// Enter your storage account name and shared key
const account = appConfig.azure.accountName;
const accountKey = appConfig.azure.accountKey;
 
// Use StorageSharedKeyCredential with storage account and account key
// StorageSharedKeyCredential is only avaiable in Node.js runtime, not in browsers
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential
);

const blobContainer = blobServiceClient.getContainerClient('uploads');

module.exports = {
   blobServiceClient,
   blobContainer
};