import { Stack, StackProps, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
// import * as utils from '../utils';

interface WebStackProps extends StackProps {
  apiGatewayUrl: string;
  updateApiEndpoint: (apiUrl: string) => void;
}

export class WebStack extends Stack {
  constructor(scope: Construct, id: string, props: WebStackProps) {
    super(scope, id, props);

    // Update API URL to frontend code (index.html)
    (async () => {
      props.updateApiEndpoint(props.apiGatewayUrl);
    })();

    // S3 Bucket for hosting the web app (private)
    const randomstr = Math.random().toString(36).substring(2,8);
    const bucket = new s3.Bucket(this, 'WebAppBucket', {
      bucketName: `ai-tutor-bucket-${randomstr}`, // Unique bucket name
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: false, // 프라이빗 모드
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    });

    // CloudFront Origin Access Identity
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'WebAppOriginAccessIdentity'
    );

    // CloudFront Web Distribution
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'WebAppDistribution',
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: originAccessIdentity,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY, // HTTP 요청 차단
      }
    );

    // S3 Bucket Policy to allow access from CloudFront
    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [`${bucket.bucketArn}/*`],
        principals: [
          new iam.CanonicalUserPrincipal(
            originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    // Deploy webapp by s3deployment
    new BucketDeployment(this, 'WebAppDeploy', {
      destinationBucket: bucket,
      distribution,
      sources: [
        // Build and deploy a React frontend app
        Source.asset('./lib/webStack/fe'),
      ],
    });

    // create CFn output but not to be exported - website URL
    new CfnOutput(this, 'DistributionDomainName', {
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}
