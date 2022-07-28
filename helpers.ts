/* eslint-disable no-new */
import * as pulumi from '@pulumi/pulumi';
import * as web from '@pulumi/azure-native/web';
import * as storage from '@pulumi/azure-native/storage';
import * as servicebus from '@pulumi/azure-native/servicebus';
import { EnvironmentConfig, AzureFunctionConfig } from './config';

type AzureConfig = {
  resourceNamePrefix: pulumi.Input<string>,
  environment: pulumi.Input<string>,
  resourceGroupName: pulumi.Input<string>,
  codeContainer: storage.BlobContainer,
  storageAccount: storage.StorageAccount,
  appServicePlan: web.AppServicePlan,
  environmentConfig: EnvironmentConfig,
};

function getConnectionString(
  resourceGroupName: pulumi.Input<string>,
  accountName: pulumi.Input<string>,
): pulumi.Output<string> {
  // Retrieve the primary storage account key.
  const storageAccountKeys = storage.listStorageAccountKeysOutput(
    { resourceGroupName, accountName },
  );
  const primaryStorageKey = storageAccountKeys.keys[0].value;

  // Build the connection string to the storage account.
  return pulumi.interpolate`DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${primaryStorageKey}`;
}

function signedBlobReadUrl(
  blob: storage.Blob,
  container: storage.BlobContainer,
  account: storage.StorageAccount,
  resourceGroup: pulumi.Input<string>,
): pulumi.Output<string> {
  const blobSAS = storage.listStorageAccountServiceSASOutput({
    accountName: account.name,
    protocols: storage.HttpProtocol.Https,
    sharedAccessExpiryTime: '2030-01-01',
    sharedAccessStartTime: '2022-04-01',
    resourceGroupName: resourceGroup,
    resource: storage.SignedResource.C,
    permissions: storage.Permissions.R,
    canonicalizedResource: pulumi.interpolate`/blob/${account.name}/${container.name}`,
    contentType: 'application/json',
    cacheControl: 'max-age=5',
    contentDisposition: 'inline',
    contentEncoding: 'deflate',
  });
  return pulumi.interpolate`https://${account.name}.blob.core.windows.net/${container.name}/${blob.name}?${blobSAS.serviceSasToken}`;
}

function createAzureFunctionResources(azureFunctionConfig: AzureFunctionConfig, {
  resourceNamePrefix,
  environment,
  resourceGroupName,
  codeContainer,
  storageAccount,
  appServicePlan,
  environmentConfig,
} : AzureConfig) : pulumi.Output<string> {
  const {
    functionAppName,
    blobName,
    projectDirectoryPath,
  } = azureFunctionConfig;

  const {
    drChonoBaseEndpoint,
    heruBaseEndpoint,
    azureKeyVaultUri,
  } = environmentConfig;

  // Upload Azure Function's code as a zip archive to the storage account.
  const codeBlob = new storage.Blob(
    `${resourceNamePrefix}${blobName}${environment}`,
    {
      resourceGroupName,
      accountName: storageAccount.name,
      containerName: codeContainer.name,
      source: new pulumi.asset.FileArchive(projectDirectoryPath),
    },
  );

  const codeBlobUrl = signedBlobReadUrl(
    codeBlob,
    codeContainer,
    storageAccount,
    resourceGroupName,
  );

  const storageConnectionString = getConnectionString(
    resourceGroupName,
    storageAccount.name,
  );

  const appSettings = [
    { name: 'AzureWebJobsStorage', value: storageConnectionString },
    { name: 'FUNCTIONS_EXTENSION_VERSION', value: '~4' },
    { name: 'FUNCTIONS_WORKER_RUNTIME', value: 'node' },
    { name: 'WEBSITE_NODE_DEFAULT_VERSION', value: '~16' },
    { name: 'WEBSITE_RUN_FROM_PACKAGE', value: codeBlobUrl },
    { name: 'DRCHRONO_BASE_ENDPOINT', value: drChonoBaseEndpoint },
    { name: 'HERU_BASE_ENDPOINT', value: heruBaseEndpoint },
    { name: 'AZURE_KEY_VAULT_URI', value: azureKeyVaultUri },
    { name: 'ENVIRONMENT', value: environment },
  ];

  const functionApp = new web.WebApp(
    `${resourceNamePrefix}${functionAppName}${environment}`,
    {
      resourceGroupName,
      serverFarmId: appServicePlan.id, // consumption plan
      kind: 'functionapp',
      siteConfig: {
        appSettings,
        http20Enabled: true,
        nodeVersion: '~16',
      },
      identity: {
        type: web.ManagedServiceIdentityType.SystemAssigned,
      },
    },
  );
}

export default {
  createAzureFunctionResources,
};
