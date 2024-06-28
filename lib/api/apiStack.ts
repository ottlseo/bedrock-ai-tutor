import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // To be added: APi Gateway & Lambda 
  }
}