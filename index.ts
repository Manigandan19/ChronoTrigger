// import * as pulumi from '@pulumi/pulumi';
// import * as storage from '@pulumi/azure-native/storage';
// import { getConnectionString, signedBlobReadUrl } from './helpers';
// import * as web from '@pulumi/azure-native/web';

// // This is the resource group name, we don't have access to create new resource group so we hard coded it..
// let resourceName = 'Krossark_RG';
// const env = 'test';
// const appName = 'cd';

// // Storage account is required by Function App.
// // Also, we will upload the function code to the same storage account.
// const storageAccount = new storage.StorageAccount(`${appName}storage${env}`, {
//   resourceGroupName: resourceName,
//   sku: {
//     name: storage.SkuName.Standard_LRS,
//   },
//   kind: storage.Kind.StorageV2,
// });

// // Function code archives will be stored in this container.
// const codeContainer = new storage.BlobContainer(`${appName}container${env}`, {
//   resourceGroupName: resourceName,
//   accountName: storageAccount.name,
// });

// // Upload Azure Function's code as a zip archive to the storage account.
// const codeBlob = new storage.Blob('authorizetestzip', {
//   resourceGroupName: resourceName,
//   accountName: storageAccount.name,
//   containerName: codeContainer.name,
//   source: new pulumi.asset.FileArchive('./AuthorizationChronoTrigger'),
// });

// const codeBlobDoc = new storage.Blob('documenttestzip', {
//   resourceGroupName: resourceName,
//   accountName: storageAccount.name,
//   containerName: codeContainer.name,
//   source: new pulumi.asset.FileArchive('./DocumentUploadChronoTrigger'),
// });

// // Define a Consumption Plan for the Function App.
// // You can change the SKU to Premium or App Service Plan if needed.
// const plan = new web.AppServicePlan('testplan', {
//   resourceGroupName: resourceName,
//   sku: {
//     name: 'Y1',
//     tier: 'Dynamic',
//   },
// });

// const storageConnectionString = getConnectionString(resourceName, storageAccount.name);
// const codeBlobUrl = signedBlobReadUrl(codeBlob, codeContainer, storageAccount, resourceName);

// const codeBlobDocUrl = signedBlobReadUrl(codeBlobDoc, codeContainer, storageAccount, resourceName);

// const app = new web.WebApp('authorizetest', {
//   resourceGroupName: resourceName,
//   serverFarmId: plan.id, //consumption plan
//   kind: 'functionapp',
//   siteConfig: {
//     appSettings: [
//       { name: 'AzureWebJobsStorage', value: storageConnectionString },
//       { name: 'FUNCTIONS_EXTENSION_VERSION', value: '~4' },
//       { name: 'FUNCTIONS_WORKER_RUNTIME', value: 'node' },
//       { name: 'WEBSITE_NODE_DEFAULT_VERSION', value: '~16' },
//       { name: 'WEBSITE_RUN_FROM_PACKAGE', value: codeBlobUrl },
//     ],
//     http20Enabled: true,
//     nodeVersion: '~16',
//   },
// });

// const appDoc = new web.WebApp('documenttest', {
//   resourceGroupName: resourceName,
//   serverFarmId: plan.id, //consumption plan
//   kind: 'functionapp',
//   siteConfig: {
//     appSettings: [
//       { name: 'AzureWebJobsStorage', value: storageConnectionString },
//       { name: 'FUNCTIONS_EXTENSION_VERSION', value: '~4' },
//       { name: 'FUNCTIONS_WORKER_RUNTIME', value: 'node' },
//       { name: 'WEBSITE_NODE_DEFAULT_VERSION', value: '~16' },
//       { name: 'WEBSITE_RUN_FROM_PACKAGE', value: codeBlobDocUrl },
//     ],
//     http20Enabled: true,
//     nodeVersion: '~16',
//   },
// });


/* eslint-disable no-new */
import * as pulumi from '@pulumi/pulumi';
import * as storage from '@pulumi/azure-native/storage';
import * as keyvault from '@pulumi/azure-native/keyvault';
// import * as resources from '@pulumi/azure-native/resources';
import * as web from '@pulumi/azure-native/web';

import helperService from './helpers';
import {
  Environment,
  environmentConfigs,
  azureFunctionConfigs,
} from './config';

/**
* This is the resource group name, we don't have access to create new resource group
* so we hard coded it..
*/
const RESOURCE_GROUP_NAME = 'Krossark_RG';
const RESOURCE_NAME_PREFIX = 'cicd';

try {

  const ENV = process.env.NODE_ENV as string;
  const RESOURCE_NAME = `${RESOURCE_NAME_PREFIX}${ENV}`;

  const STACK = ENV as Environment;
  const environmentConfig = environmentConfigs[STACK];

  //  We don't have rights to create/update a resource group in azure so now we are using
  //  existing resource group. So we just commenting the below lines
  //  Create a separate resource group for this example.
  //  new resources.ResourceGroup(`${RESOURCE_GROUP_NAME}`, {
  //    location: environmentConfig.location,
  //    resourceGroupName: RESOURCE_GROUP_NAME,
  //  });

  // Storage account is required by Function App.
  // Also, we will upload the function code to the same storage account.
  const storageAccount = new storage.StorageAccount(RESOURCE_NAME, {
    resourceGroupName: RESOURCE_GROUP_NAME,
    sku: {
      name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.StorageV2,
  });

  // Function code archives will be stored in this container.
  const codeContainer = new storage.BlobContainer(RESOURCE_NAME, {
    resourceGroupName: RESOURCE_GROUP_NAME,
    accountName: storageAccount.name,
  });

  // Define a Consumption Plan for the Function App.
  // You can change the SKU to Premium or App Service Plan if needed.
  const appServicePlan = new web.AppServicePlan(RESOURCE_NAME, {
    resourceGroupName: RESOURCE_GROUP_NAME,
    sku: {
      name: 'Y1',
      tier: 'Dynamic',
    },
  });

  const azureResourceConfig = {
    resourceNamePrefix: RESOURCE_NAME_PREFIX,
    environment: ENV,
    resourceGroupName: RESOURCE_GROUP_NAME,
    codeContainer,
    storageAccount,
    appServicePlan,
    environmentConfig,
  };

  const azureFunctionPrincipalIds = azureFunctionConfigs.map(
    (azureFunctionConfig: any) => helperService.createAzureFunctionResources(
      azureFunctionConfig,
      azureResourceConfig,
    ),
  );
} catch (exception) {
  pulumi.log.error(`Error Occurred: ${exception?.message}`);
}
