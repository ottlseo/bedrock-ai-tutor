#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { UserInterfaceStack } from "./user-interface-stack";

const app = new cdk.App();
new UserInterfaceStack(app, "UserInterfaceStack"
    // {
    // env: {
    //     account: app.node.tryGetContext('aws:accountId'),
    //     region: 'us-east-1',
    //   },
    // }
        // "aws:accountId": "590183997414",
);
