---
layout: post
title: Macro - Serverless
date: 2020-02-13 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Quick serverless functions with minimal config
tags: [cloudformation, include, lambda, macro]
docs:
  - "<a href = \"https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html\">AWS docs on cloudformation Serverless Resource Types</a>"
skill: intermediate
---

The Cloudformation Serverless Transform is an AWS managed transform that takes an number of properties an expands them into a fully working lambda function with all associated resources

<div class="card tip">
  <div class="card-body">
    When using this transform, keep in mind that there is a limit on what is supported. So for simple pocs and quick work, its fantastic. But for quite large projects with shared resources, etc... You might be better off creating the resources yourself
  </div>
</div>
  
In the example below, the transform (template1), will create template2 when applied

1. [Template1 - template that runs the transform](#template1)
2. [Template2 - resultant template](#template2)

---

<a name = "template1"></a>
##### template1 (template that runs the transform)

```json
{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description": "A description to help identify the purpose of the template",
  "Transform": "AWS::Serverless-2016-10-31",
  "Resources": {
    "ServerlessFunction": {
      "Type" : "AWS::Serverless::Function",
      "Properties" : {
        "Handler": "index.handler",
        "Runtime": "nodejs8.10",
        "CodeUri": "s3://testBucket/mySourceCode.zip"
      }
    }
  }
}
```
```yml
---
AWSTemplateFormatVersion: '2010-09-09'
Description: A description to help identify the purpose of the template
Transform: AWS::Serverless-2016-10-31
Resources:
  ServerlessFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: index.handler
      Runtime: nodejs8.10
      CodeUri: s3://testBucket/mySourceCode.zip
```

---

<a name = "template2"></a>
##### template2 (resultant template)

This is what cloudformation will actually process. This is hidden under the hood as its transformed at runtime - when the cloudformation operation is triggered

```json
{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description": "A description to help identify the purpose of the template",
  "Resources": {
    "ServerlessFunction": {
      "Type": "AWS::Lambda::Function",
      "Properties": {
        "Handler": "index.handler",
        "Code": {
          "S3Bucket": "testBucket",
          "S3Key": "mySourceCode.zip"
        },
        "Role": {
          "Fn::GetAtt": ["FunctionNameRole", "Arn"]
        },
        "Runtime": "nodejs8.10"
      }
    },
    "FunctionNameRole": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "ManagedPolicyArns": ["arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"],
        "AssumeRolePolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [{
            "Action": ["sts:AssumeRole"],
            "Effect": "Allow",
            "Principal": {
              "Service": ["lambda.amazonaws.com"]
            }
          }]
        }
      }
    }
  }
}
```
```yml
---
AWSTemplateFormatVersion: '2010-09-09'
Description: A description to help identify the purpose of the template
Resources:
  ServerlessFunction:
    Type: AWS::Lambda::Function
    Properties:
      Handler: index.handler
      Code:
        S3Bucket: testBucket
        S3Key: mySourceCode.zip
      Role: !GetAtt 'FunctionNameRole.Arn'
      Runtime: nodejs8.10
  FunctionNameRole:
    Type: AWS::IAM::Role
    Properties:
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Action:
              - sts:AssumeRole
            Effect: Allow
            Principal:
              Service:
                - lambda.amazonaws.com
```
