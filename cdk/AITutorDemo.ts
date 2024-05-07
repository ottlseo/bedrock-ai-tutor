#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { WebStack } from "./WebStack";

const app = new cdk.App();
new WebStack(app, "WebStack"
    // {
    // env: {
    //     account: app.node.tryGetContext('aws:accountId'),
    //     region: 'us-east-1',
    //   },
    // }
        // "aws:accountId": "590183997414",
);
