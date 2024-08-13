#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ApiStack } from "../lib/apiStack/apiStack";
import { WebStack } from "../lib/webStack/webStack";

const STACK_PREFIX = "AITutor"; // 여기를 변경해주세요
const DEFAULT_REGION = "us-west-2";
const envSetting = {
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: DEFAULT_REGION,
  },
};

const app = new cdk.App();

new ApiStack(app, `${STACK_PREFIX}-ApiStack`, envSetting);
new WebStack(app, `${STACK_PREFIX}-WebStack`, envSetting);

app.synth();
