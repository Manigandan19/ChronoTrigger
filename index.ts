import * as pulumi from '@pulumi/pulumi';
import * as storage from '@pulumi/azure-native/storage';
import { getConnectionString, signedBlobReadUrl } from './helpers';
import * as web from '@pulumi/azure-native/web';

// This is the resource group name, we don't have access to create new resource group so we hard coded it..
let resourceName = 'Krossark_RG';
const env = 'test';
const appName = 'cd';

// Storage account is required by Function App.
// Also, we will upload the function code to the same storage account.
const storageAccount = new storage.StorageAccount(`${appName}storage${env}`, {
  resourceGroupName: resourceName,
  sku: {
    name: storage.SkuName.Standard_LRS,
  },
  kind: storage.Kind.StorageV2,
});

// Function code archives will be stored in this container.
const codeContainer = new storage.BlobContainer(`${appName}container${env}`, {
  resourceGroupName: resourceName,
  accountName: storageAccount.name,
});

// Upload Azure Function's code as a zip archive to the storage account.
const codeBlob = new storage.Blob('authorizetestzip', {
  resourceGroupName: resourceName,
  accountName: storageAccount.name,
  containerName: codeContainer.name,
  source: new pulumi.asset.FileArchive('./AuthorizationChronoTrigger'),
});

// Define a Consumption Plan for the Function App.
// You can change the SKU to Premium or App Service Plan if needed.
const plan = new web.AppServicePlan('testplan', {
  resourceGroupName: resourceName,
  sku: {
    name: 'Y1',
    tier: 'Dynamic',
  },
});

const storageConnectionString = getConnectionString(resourceName, storageAccount.name);
const codeBlobUrl = signedBlobReadUrl(codeBlob, codeContainer, storageAccount, resourceName);

const app = new web.WebApp('authorizetest', {
  resourceGroupName: resourceName,
  serverFarmId: plan.id, //consumption plan
  kind: 'functionapp',
  siteConfig: {
    appSettings: [
      { name: 'AzureWebJobsStorage', value: storageConnectionString },
      { name: 'FUNCTIONS_EXTENSION_VERSION', value: '~4' },
      { name: 'FUNCTIONS_WORKER_RUNTIME', value: 'node' },
      { name: 'WEBSITE_NODE_DEFAULT_VERSION', value: '~16' },
      { name: 'WEBSITE_RUN_FROM_PACKAGE', value: codeBlobUrl },
    ],
    http20Enabled: true,
    nodeVersion: '~16',
  },
});


