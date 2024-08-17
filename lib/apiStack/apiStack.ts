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
    const haikuLambdaFunction = new lambda.Function(this, "callHaikuLambda", {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset("./lib/apiStack/lambdas"),
      handler: "callHaikuLambda.lambda_handler",
      layers: [layer],
      timeout: Duration.minutes(5), // 제한 시간 5분으로 설정
      memorySize: 512, // 메모리 할당량 512MB로 설정
      initialPolicy: [bedrockAccessPolicy], // Bedrock 액세스 권한 부여
    });

    const sonnetLambdaFunction = new lambda.Function(this, "callSonnetLambda", {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset("./lib/apiStack/lambdas"),
      handler: "callSonnetLambda.lambda_handler",
      layers: [layer],
      timeout: Duration.minutes(5),
      memorySize: 512,
      initialPolicy: [bedrockAccessPolicy],
    });

    const businessLambdaFunction = new lambda.Function(this, "generateBusinessVerLambda", {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset("./lib/apiStack/lambdas"),
      handler: "generateBusinessVerLambda.lambda_handler",
      layers: [layer],
      timeout: Duration.minutes(5),
      memorySize: 512,
      initialPolicy: [bedrockAccessPolicy],
    });

    const casualLambdaFunction = new lambda.Function(this, "generateCasualVerLambda", {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset("./lib/apiStack/lambdas"),
      handler: "generateCasualVerLambda.lambda_handler",
      layers: [layer],
      timeout: Duration.minutes(5),
      memorySize: 512,
      initialPolicy: [bedrockAccessPolicy],
    });

    // API Gateway 생성
    const api = new apigw.RestApi(this, "AiTutorAPI", {
      restApiName: "AiTutorAPI",
      description: "Bedrock AI Tutor API created by CDK",
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
        allowHeaders: apigw.Cors.DEFAULT_HEADERS,
      },
      endpointTypes: [apigw.EndpointType.REGIONAL], // endpoint 유형을 Regional로 설정
    });

    // CORS 허용 관련 설정 (통합 응답, 메서드 응답 정의)
    const integrationResponse = {
      proxy: false,
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Origin": "'*'",
          },
          responseTemplates: {
            "application/json": ""
          },
        },
      ],
    };

    const methodResponse = {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Origin": true, // Response headers를 Access-Control-Allow-Origin으로 설정
          },
          responseModels: {
            "application/json": apigw.Model.EMPTY_MODEL, // Response body를 application/json으로 빈 값으로 설정
          },
        },
      ],
    };

    // Lambda 함수를 API Gateway에 POST 메서드로 연결
    const haikuLambdaIntegration = new apigw.LambdaIntegration(haikuLambdaFunction, integrationResponse);
    const sonnetLambdaIntegration = new apigw.LambdaIntegration(sonnetLambdaFunction, integrationResponse);
    const businessLambdaIntegration = new apigw.LambdaIntegration(businessLambdaFunction, integrationResponse);
    const casualLambdaIntegration = new apigw.LambdaIntegration(casualLambdaFunction, integrationResponse);

    api.root.addResource("haiku").addMethod("POST", haikuLambdaIntegration, methodResponse);
    api.root.addResource("sonnet").addMethod("POST", sonnetLambdaIntegration, methodResponse);
    api.root.addResource("business").addMethod("POST", businessLambdaIntegration, methodResponse);
    api.root.addResource("casual").addMethod("POST", casualLambdaIntegration, methodResponse);

    // API Gateway URL 출력
    new CfnOutput(this, "ApiGatewayUrl", {
      value: `${api.url}`,
      description: "AI Tutor API Gateway endpoint URL for Prod stage",
    });
  }
}