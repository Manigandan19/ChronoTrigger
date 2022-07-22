#!/bin/bash

# exit if a command returns a non-zero exit code and also print the commands and their args as they are executed
set -e -x

# Add the pulumi CLI to the PATH
export PATH=$PATH:$HOME/.pulumi/bin

pushd /

npm install
npm run build

pulumi stack select test

# https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=vsts
case $BUILD_REASON in
  PullRequest)
      pulumi preview
    ;;
  BuildCompletion|BatchedCI)
      pulumi up --yes
    ;;
  *)
esac

# Save the stack output variables to job variables.
# Note: Before the `pulumi up` is run for the first time, there are no stack output variables.
# The pulumi program exports three values: resourceGroupName, storageAccountName and containerName.
echo "##vso[task.setvariable variable=resourceGroupName;isOutput=true]$(pulumi stack output resourceGroupName)"
echo "##vso[task.setvariable variable=storageAccountName;isOutput=true]$(pulumi stack output storageAccountName)"
echo "##vso[task.setvariable variable=containerName;isOutput=true]$(pulumi stack output containerName)"

popd