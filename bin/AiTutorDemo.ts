#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { WebStack } from "../lib/webStack/webStack";
import { ApiStack } from "../lib/apiStack/apiStack";

const app = new cdk.App();

new WebStack(app, "WebStack");

new ApiStack(app, "ApiStack");

app.synth();
