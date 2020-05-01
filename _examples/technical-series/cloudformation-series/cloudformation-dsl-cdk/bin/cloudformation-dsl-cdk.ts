#!/usr/bin/env node
import s3 = require('@aws-cdk/aws-s3');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');

class CloudformationDslCdkStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    const s3Bucket = new s3.Bucket(this, 'S3Bucket', {});

    const iamRole = new iam.Role(this, 'IAMRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
    });
    
    iamRole.addToPolicy(new iam.PolicyStatement()
          .addResource(s3Bucket.arnForObjects('*'))
          .addResource(s3Bucket.bucketArn)
          .addActions('s3:*'));
  }
}

const app = new cdk.App();

new CloudformationDslCdkStack(app, 'CloudformationDslCdkStack');

app.run();
