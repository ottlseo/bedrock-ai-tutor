#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ApiStack } from "../lib/apiStack/apiStack";
import { WebStack } from "../lib/webStack/webStack";

const app = new cdk.App();

new ApiStack(app, "ApiStack");

new WebStack(app, "WebStack");

app.synth();
