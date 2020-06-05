const { blobServiceClient } = require('../service/azure-blob-storage.service');
const { appConfig } = require('../config')
const setup = async () => {
   const { containerClient } = await blobServiceClient.createContainer(appConfig.azure.containerName, {
      access: 'blob'
   });
   console.info('azure container has been created: ', { name: containerClient.accountName, url: containerClient.url });
}

setup();