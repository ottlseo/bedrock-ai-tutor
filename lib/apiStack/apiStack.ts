import { Stack, StackProps, CfnOutput, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Layer 생성
    const layer = new lambda.LayerVersion(this, "AiTutorLambdaLayer", {
      code: lambda.Code.fromAsset("./lib/apiStack/lambdas/layer/python.zip"),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_9],
    });

    // Bedrock 액세스 권한 정책
    const bedrockAccessPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["bedrock:*"],
      resources: ["*"],
    });

    // Lambda 함수 생성
    const lambdaFunction1 = new lambda.Function(this, "callHaikuLambda", {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset("./lib/apiStack/lambdas"),
      handler: "callHaikuLambda.lambda_handler",
      layers: [layer],
      timeout: Duration.minutes(10), // 제한 시간 10분으로 설정
      memorySize: 512, // 메모리 할당량 512MB로 설정
      initialPolicy: [bedrockAccessPolicy], // Bedrock 액세스 권한 부여
    });

    const lambdaFunction2 = new lambda.Function(this, "callSonnetLambda", {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset("./lib/apiStack/lambdas"),
      handler: "callSonnetLambda.lambda_handler",
      layers: [layer],
      timeout: Duration.minutes(10), // 제한 시간 10분으로 설정
      memorySize: 512, // 메모리 할당량 512MB로 설정
      initialPolicy: [bedrockAccessPolicy], // Bedrock 액세스 권한 부여
    });

    const lambdaFunction3 = new lambda.Function(this, "generateBusinessVerLambda", {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset("./lib/apiStack/lambdas"),
      handler: "generateBusinessVerLambda.lambda_handler",
      layers: [layer],
      timeout: Duration.minutes(10), // 제한 시간 10분으로 설정
      memorySize: 512, // 메모리 할당량 512MB로 설정
      initialPolicy: [bedrockAccessPolicy], // Bedrock 액세스 권한 부여
    });

    // API Gateway 생성
    const api = new apigw.RestApi(this, "AiTutorAPI", {
      restApiName: "AiTutorAPI",
      description: "Bedrock AI Tutor API created by CDK",
    });
    // TODO: API GW Policy 추가

    // Lambda 함수를 API Gateway에 연결
    const lambdaIntegration1 = new apigw.LambdaIntegration(lambdaFunction1);
    const lambdaIntegration2 = new apigw.LambdaIntegration(lambdaFunction2);
    const lambdaIntegration3 = new apigw.LambdaIntegration(lambdaFunction3);

    api.root.addResource("haiku").addMethod("GET", lambdaIntegration1);
    api.root.addResource("sonnet").addMethod("GET", lambdaIntegration2);
    api.root.addResource("business").addMethod("GET", lambdaIntegration3);

    // API Gateway URL 출력
    new CfnOutput(this, "GatewayUrl", {
      value: "https://"+api.url,
      description: "API Gateway endpoint URL for Prod stage",
    });
  }
}