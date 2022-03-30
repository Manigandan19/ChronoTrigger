import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as azure_native from "@pulumi/azure-native";
import { getConnectionString, signedBlobReadUrl } from "./helpers";
import * as web from "@pulumi/azure-native/web";

// let config = new pulumi.config();
let config = new pulumi.Config();
let location = config.require("location");
let objectId = config.require("objectId");
let tenandId = config.require("tenandId");
// let tenandId = "415af657-03d2-4a1c-8c2e-ac154dceb8fb";
//let resourceName = "authorizationChronoTrigger-functions-dev";
let resourceName = "Krossark_RG";


// Create a separate resource group for this example.
//const resourceGroup = new resources.ResourceGroup(resourceName);

// Storage account is required by Function App.
// Also, we will upload the function code to the same storage account.
const storageAccount = new storage.StorageAccount("chronotrigger", {
    resourceGroupName: resourceName,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.StorageV2,
});

const vault = new azure_native.keyvault.Vault("vault", {
    location: location,
    properties: {
        accessPolicies: [{
            objectId: objectId,
            permissions: {
                certificates: [
                    "get",
                    "list",
                    "delete",
                    "create",
                    "import",
                    "update",
                    "managecontacts",
                    "getissuers",
                    "listissuers",
                    "setissuers",
                    "deleteissuers",
                    "manageissuers",
                    "recover",
                    "purge",
                ],
                keys: [
                    "encrypt",
                    "decrypt",
                    "wrapKey",
                    "unwrapKey",
                    "sign",
                    "verify",
                    "get",
                    "list",
                    "create",
                    "update",
                    "import",
                    "delete",
                    "backup",
                    "restore",
                    "recover",
                    "purge",
                ],
                secrets: [
                    "get",
                    "list",
                    "set",
                    "delete",
                    "backup",
                    "restore",
                    "recover",
                    "purge",
                ],
            },
            tenantId: tenandId,
        }],
        enabledForDeployment: true,
        enabledForDiskEncryption: true,
        enabledForTemplateDeployment: true,
        sku: {
            family: "A",
            name: "standard",
        },
        tenantId: tenandId,
    },
    resourceGroupName: resourceName,
    vaultName: "testtriggervault",
});

// Function code archives will be stored in this container.
const codeContainer = new storage.BlobContainer("chronotriggercontainer", {
    resourceGroupName: resourceName,
    accountName: storageAccount.name,
});

// Upload Azure Function's code as a zip archive to the storage account.
const codeBlob = new storage.Blob("zip", {
    resourceGroupName: resourceName,
    accountName: storageAccount.name,
    containerName: codeContainer.name,
    source: new pulumi.asset.FileArchive("./authorizationChronoTrigger")
});

// Define a Consumption Plan for the Function App.
// You can change the SKU to Premium or App Service Plan if needed.
const plan = new web.AppServicePlan("plan", {
    resourceGroupName: resourceName,
    sku: {
        name: "Y1",
        tier: "Dynamic",
    },
});

const storageConnectionString = getConnectionString(resourceName, storageAccount.name);
const codeBlobUrl = signedBlobReadUrl(codeBlob, codeContainer, storageAccount, resourceName);

const app = new web.WebApp("authorizationtriggerfunc", {
    resourceGroupName: resourceName,
    serverFarmId: plan.id,//consumption plan
    kind: "functionapp",
    siteConfig: {
        appSettings: [
            { name: "AzureWebJobsStorage", value: storageConnectionString },
            { name: "FUNCTIONS_EXTENSION_VERSION", value: "~4" },
            { name: "FUNCTIONS_WORKER_RUNTIME", value: "node" },
            { name: "WEBSITE_NODE_DEFAULT_VERSION", value: "~16" },
            { name: "WEBSITE_RUN_FROM_PACKAGE", value: codeBlobUrl },
        ],
        http20Enabled: true,
        nodeVersion: "~16",
    },
});

// Export the primary key of the Storage Account
const storageAccountKeys = pulumi.all([resourceName, storageAccount.name]).apply(([resourceGroupName, accountName]) =>
    storage.listStorageAccountKeys({ resourceGroupName, accountName }));
export const primaryStorageKey = storageAccountKeys.keys[0].value;

export const endpoint = pulumi.interpolate`https://${app.defaultHostName}/api/httpTrigger?code=tdfhg6564`;

