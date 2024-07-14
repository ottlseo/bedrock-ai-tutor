#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ApiStack } from "../lib/apiStack/apiStack";
import { WebStack } from "../lib/webStack/webStack";
import { updateApiEndpointToWebStack } from "../lib/utils";

const app = new cdk.App();

const apiStack = new ApiStack(app, "ApiStack");

const webStack = new WebStack(app, "WebStack", {
    apiGatewayUrl: cdk.Fn.importValue('ApiGatewayUrlOutput'),
    updateApiEndpoint: updateApiEndpointToWebStack,
});
webStack.addDependency(apiStack);

app.synth();
