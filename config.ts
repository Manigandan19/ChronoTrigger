export type Environment = 'test' | 'dev' | 'stage' | 'prod';

export type EnvironmentConfig = {
  location: string
  objectId: string
  tenantId: string
  drChonoBaseEndpoint: string
  heruBaseEndpoint: string
  azureKeyVaultUri: string
};

export type AzureFunctionConfig = {
  functionAppName: string
  blobName: string
  projectDirectoryPath: string
};

export const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  test: {
    location: 'eastus',
    objectId: '90cf9853-d330-4bcf-8e87-269fb69e9672',
    tenantId: '415af657-03d2-4a1c-8c2e-ac154dceb8fb',
    drChonoBaseEndpoint: 'https://app.drchrono.com/',
    heruBaseEndpoint: 'https://portal-api.dev.seeheru.com/',
    azureKeyVaultUri: 'https://chronodevvault.vault.azure.net/',
  },
  dev: {
    location: 'eastus',
    objectId: '90cf9853-d330-4bcf-8e87-269fb69e9672',
    tenantId: '415af657-03d2-4a1c-8c2e-ac154dceb8fb',
    drChonoBaseEndpoint: 'https://app.drchrono.com/',
    heruBaseEndpoint: 'https://portal-api.dev.seeheru.com/',
    azureKeyVaultUri: 'https://chronodevvault.vault.azure.net/',
  },
  stage: {
    location: 'eastus',
    objectId: '90cf9853-d330-4bcf-8e87-269fb69e9672',
    tenantId: '415af657-03d2-4a1c-8c2e-ac154dceb8fb',
    drChonoBaseEndpoint: 'https://app.drchrono.com/',
    heruBaseEndpoint: 'https://portal-api.stg.seeheru.com/',
    azureKeyVaultUri: 'https://chronostage.vault.azure.net/',
  },
  prod: {
    location: 'eastus',
    objectId: '90cf9853-d330-4bcf-8e87-269fb69e9672',
    tenantId: '415af657-03d2-4a1c-8c2e-ac154dceb8fb',
    drChonoBaseEndpoint: 'https://app.drchrono.com/',
    heruBaseEndpoint: 'https://portal-api.prod.seeheru.com/',
    azureKeyVaultUri: 'https://chronoprod.vault.azure.net/',
  },
};

export const azureFunctionConfigs: Array<AzureFunctionConfig> = [
  {
    functionAppName: 'authorizetest',
    blobName: 'authorizationtriggerzip',
    projectDirectoryPath: './AuthorizationChronoTrigger',
  },
];
