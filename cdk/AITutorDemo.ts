#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { WebStack } from "./WebStack";

const app = new cdk.App();
new WebStack(app, "WebStack");
