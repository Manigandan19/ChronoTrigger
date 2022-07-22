# Deploy and Manage Chrono Trigger on Clouds

[Pulumi](https://github.com/heru-inc/chrono-trigger.git)

## Introduction


-   This projects uses [Pulumi](https://www.pulumi.com) to easy and quickly deploy [Chrono Trigger](https://github.com/heru-inc/chrono-trigger.git) into Clouds with single command (`pulumi up --yes`).
-   It currently supports Azure (storage account, key vault creation).

## Quick start

-   Setup [Pulumi](https://www.pulumi.com/docs/reference/install)
-   Setup [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli)
-   Change (optionally) Pulumi Stack with `pulumi stack select dev`, where `dev` is stack name.
-   Deploy to Cloud: `pulumi up --yes`

Note: Different stacks may use different services.

Links:
-   Read more about Pulumi at <https://github.com/pulumi/pulumi>

## Implementation

Implementation currently based on Pulumi libraries specific to Azure Cloud.
That's why no other Clouds currently supported, but it should be possible at some point to rewrite code using Pulumi Cloud-Agnostic Packages,
## See following links:
- <https://github.com/pulumi/pulumi-cloud>,
- <https://www.pulumi.com/docs/reference/pkg/nodejs/pulumi/cloud>,
- <https://www.pulumi.com/docs/tutorials/cloudfx>, etc.
(Azure and AWS clouds should be supported in such case)


### Branches, Pulumi Stacks and Environments

We have branche for Chrono-Trigger Pulumi repo:

-   `master` branch for deployments to `prod`, `dev` and `demo` environments


Each Github branch may correspond to separate Pulumi Stacks in the future.


## TODO

-   [ ] Need to setup Github Actions.
 See also <https://www.pulumi.com/docs/guides/continuous-delivery>

## Pulumi related Open-Source projects and Examples

-   Github Pulumi Actions: see <https://github.com/pulumi/actions> and <https://www.pulumi.com/docs/guides/continuous-delivery/github-actions>


