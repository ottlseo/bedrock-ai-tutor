import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Layer 생성
    const layer = new lambda.LayerVersion(this, "AiTutorLambdaLayer", {
      code: lambda.Code.fromAsset("./lambda/layer/python.zip"),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_9],
    });

    // Lambda 함수 생성
    const lambdaFunction1 = new lambda.Function(this, "callHaikuLambda", {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset("./lambda/callHaikuLambda.py"),
      handler: "index.handler",
      layers: [layer],
    });

    const lambdaFunction2 = new lambda.Function(this, "callSonnetLambda", {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset("./lambda/callSonnetLambda.py"),
      handler: "index.handler",
      layers: [layer],
    });

    const lambdaFunction3 = new lambda.Function(this, "generateBusinessVerLambda", {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset("./lambda/generateBusinessVerLambda.py"),
      handler: "index.handler",
      layers: [layer],
    });

    // API Gateway 생성
    const api = new apigw.RestApi(this, "AiTutorAPI", {
      restApiName: "AiTutorAPI",
      description: "Bedrock AI Tutor API created by CDK",
    });

    // Lambda 함수를 API Gateway에 연결
    const lambdaIntegration1 = new apigw.LambdaIntegration(lambdaFunction1);
    const lambdaIntegration2 = new apigw.LambdaIntegration(lambdaFunction2);
    const lambdaIntegration3 = new apigw.LambdaIntegration(lambdaFunction3);

    api.root.addResource("lambda1").addMethod("GET", lambdaIntegration1);
    api.root.addResource("lambda2").addMethod("GET", lambdaIntegration2);
    api.root.addResource("lambda3").addMethod("GET", lambdaIntegration3);

    // API Gateway URL 출력
    new CfnOutput(this, "GatewayUrl", {
      value: api.url,
      description: "API Gateway endpoint URL for Prod stage",
    });
  }
}