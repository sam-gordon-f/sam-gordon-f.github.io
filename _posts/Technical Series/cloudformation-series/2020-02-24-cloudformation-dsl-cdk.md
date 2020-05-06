---
layout: post
title: "DSL - CDK"
date: 2020-02-24 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: model your templates in an AWS supported DSL (domain-specific language)
tags: [cloudformation, cdk]
skill: proficient
---

Templates can be generated using a range of different languages. One such aws supported project is cdk

In the below example. These are the areas that make up a solution

1. [Initial setup](#initial-setup)
2. [Template (typescript)](#template)
3. [Conversion / Deployment](#conversion-deployment)
4. [Result](#result)

---

<a name = "initial-setup"></a>
#### 1) Initial Setup

You'll need to install the framework. Refer to <a href = "https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html">this</a> for pre-reqs

```
# install
npm install -g aws-cdk

# init project (typescript)
cdk init --language typescript
```

<br>

<a name = "template"></a>
#### 2) Template

Location :: `<<folderName>>/bin/<<projectName>>.ts`

The below sample creates an S3::Bucket, and an IAM role/policies that would grant a lambda function assuming access

```typescript
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
```

<br>

<a name = "conversion-deployment"></a>
#### 3) Conversion / Deployment

From the directory you create your rake file, run the below

```
# convert typescript to js
npm run build

# convert js to yml
cdk synth

# convert js to json
cdk synth -j

# deploy
cdk deploy

# check changes locally with remote stack
cdk diff
```

<br>

<a name = "result"></a>
#### 4) Result

Sample output from the above template / config

```json
{
  "Resources": {
    "S3Bucket07682993": {
      "Type": "AWS::S3::Bucket",
      "Metadata": {
        "aws:cdk:path": "CloudformationDslCdkStack/S3Bucket/Resource"
      }
    },
    "IAMRole24D9329E": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "Service": "lambda.amazonaws.com"
              }
            }
          ],
          "Version": "2012-10-17"
        }
      },
      "Metadata": {
        "aws:cdk:path": "CloudformationDslCdkStack/IAMRole/Resource"
      }
    },
    "IAMRoleDefaultPolicy0600C170": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": "s3:*",
              "Effect": "Allow",
              "Resource": [
                {
                  "Fn::Join": [
                    "",
                    [
                      {
                        "Fn::GetAtt": [
                          "S3Bucket07682993",
                          "Arn"
                        ]
                      },
                      "/*"
                    ]
                  ]
                },
                {
                  "Fn::GetAtt": [
                    "S3Bucket07682993",
                    "Arn"
                  ]
                }
              ]
            }
          ],
          "Version": "2012-10-17"
        },
        "PolicyName": "IAMRoleDefaultPolicy0600C170",
        "Roles": [
          {
            "Ref": "IAMRole24D9329E"
          }
        ]
      },
      "Metadata": {
        "aws:cdk:path": "CloudformationDslCdkStack/IAMRole/DefaultPolicy/Resource"
      }
    },
    "CDKMetadata": {
      "Type": "AWS::CDK::Metadata",
      "Properties": {
        "Modules": "@aws-cdk/aws-codepipeline-api=0.18.1,@aws-cdk/aws-events=0.18.1,@aws-cdk/aws-iam=0.18.1,@aws-cdk/aws-kms=0.18.1,@aws-cdk/aws-s3=0.18.1,@aws-cdk/aws-s3-notifications=0.18.1,@aws-cdk/cdk=0.18.1,@aws-cdk/cx-api=0.18.1,cloudformation-dsl-cdk=0.1.0"
      }
    }
  }
}
```
