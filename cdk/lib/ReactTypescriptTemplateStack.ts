import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class ReactTypescriptTemplateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Frontend Setup
    // Route53 Records for Site Hosting
    const domainName = 'grantstarkman.com';
    const hostedZone = route53.HostedZone.fromLookup(
      this,
      'ReactTypescriptTemplateHostedZone',
      {
        domainName: domainName,
      }
    );

    // S3 Bucket for Website Hosting
    const ReactTypescriptTemplateWebsiteBucket = new s3.Bucket(
      this,
      'ReactTypescriptTemplateWebsiteBucket',
      {
        bucketName: 'reacttypescripttemplate',
        websiteIndexDocument: 'index.html',
        removalPolicy: RemovalPolicy.RETAIN,
        versioned: true,
        blockPublicAccess: {
          blockPublicAcls: false,
          blockPublicPolicy: false,
          ignorePublicAcls: false,
          restrictPublicBuckets: false,
        },
        publicReadAccess: true,
      }
    );

    new cdk.CfnOutput(this, 'ReactTypescriptTemplateWebsiteBucketDomainName', {
      value: ReactTypescriptTemplateWebsiteBucket.bucketDomainName,
      description:
        'The domain name of the S3 bucket for the React Typescript Template website.',
    });

    new cdk.CfnOutput(
      this,
      'ReactTypescriptTemplateWebsiteBucketWebsiteUrlOutput',
      {
        value: ReactTypescriptTemplateWebsiteBucket.bucketWebsiteUrl,
        description:
          'The website URL of the S3 bucket for the React Typescript Template website.',
      }
    );

    new s3deploy.BucketDeployment(this, `DeployReactTypescriptTemplate`, {
      sources: [s3deploy.Source.asset('../dist')],
      destinationBucket: ReactTypescriptTemplateWebsiteBucket,
    });

    const ReactTypescriptTemplateCloudfrontSiteCertificate =
      new acm.Certificate(
        this,
        'ReactTypescriptTemplateCloudfrontSiteCertificate',
        {
          domainName: 'reacttypescripttemplate.grantstarkman.com',
          certificateName: 'reacttypescripttemplate.grantstarkman.com',
          validation: acm.CertificateValidation.fromDns(hostedZone),
        }
      );

    // Cloudfront Distribution for Frontend
    const ReactTypescriptTemplateDistribution = new cloudfront.Distribution(
      this,
      'ReactTypescriptTemplateDistribution',
      {
        comment: `CloudFront distribution for ${ReactTypescriptTemplateWebsiteBucket.bucketName} bucket.`,
        defaultBehavior: {
          origin: new origins.S3Origin(ReactTypescriptTemplateWebsiteBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        },
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: '/404.html',
          },
        ],
        defaultRootObject: 'index.html',
        domainNames: ['reacttypescripttemplate.grantstarkman.com'],
        certificate: ReactTypescriptTemplateCloudfrontSiteCertificate,
      }
    );

    new cdk.CfnOutput(this, 'ReactTypescriptTemplateDistributionDomainName', {
      value: ReactTypescriptTemplateDistribution.domainName,
      description:
        'The domain name of the CloudFront distribution for the React Typescript Template website.',
    });

    // Route 53 Records for Cloudfront Distribution Frontend
    new route53.ARecord(this, `ReactTypescriptTemplateCloudFrontARecord`, {
      zone: hostedZone,
      recordName: 'reacttypescripttemplate.grantstarkman.com',
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(ReactTypescriptTemplateDistribution)
      ),
    });

    new cdk.CfnOutput(this, 'ReactTypescriptTemplateCloudfrontRecordName', {
      value: 'reacttypescripttemplate.grantstarkman.com',
    });
  }
}
