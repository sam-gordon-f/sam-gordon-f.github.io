---
layout: post
title: Macro - Custom
date: 2020-02-02 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Custom Macros for Cloudformation templates
tags: [cloudformation, include, lambda, macro]
prevPost:
  text: "Macros - Serverless"
  link: "/technical-series/cloudformation-series/cloudformation-macros-serverless"
docs:
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-macros.html\">AWS docs on cloudformation Transforms</a>"
tips:
  - "You must define the macro `beforehand` in another template/stack before trying to run"
  - "You can also use lambda alias's / versions when defining their ARNs in the macro below"
skill: expert
---

When defining your own custom macros, you need to create the lambda function / macro definition in advance.
In the following two examples, there is already a lambda function created in the same account (named `lambdaFunction1`)
<br><br>
The referencer is using the macro in the header (see <a href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-macros">here</a> for more details)

1. [Template1 - template defines the macro](#template1)
2. [Template2 - template that uses the custom macro](#template2)

---

<a name = "template1"></a>
##### template1 (template that defines the transform)

```json
{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description": "A description to help identify the purpose of the template",
  "Resources": {
    "IAMRole": {
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
    },
    "LambdaFunction": {
      "Type": "AWS::Lambda::Function",
      "Properties": {
        "Handler": "index.handler",
        "Code": {
          "S3Bucket": "testBucket",
          "S3Key": "mySourceCode.zip"
        },
        "Role": {
          "Fn::GetAtt": ["IAMRole", "Arn"]
        },
        "Runtime": "nodejs8.10"
      }
    },
    "cloudformationMacro": {
      "Type" : "AWS::CloudFormation::Macro",
      "Properties" : {
        "Description" : "my testing macro",
        "FunctionName" : {
          "Fn::GetAtt": [
            "LambdaFunction",
            "Arn"
          ]
        },
        "Name" : "cloudformationMacro"
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
  IAMRole:
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
  LambdaFunction:
    Type: AWS::Lambda::Function
    Properties:
      Handler: index.handler
      Code:
        S3Bucket: testBucket
        S3Key: mySourceCode.zip
      Role: !GetAtt 'IAMRole.Arn'
      Runtime: nodejs8.10
  cloudformationMacro:
    Type: AWS::CloudFormation::Macro
    Properties:
      Description: my testing macro
      FunctionName: !GetAtt 'LambdaFunction.Arn'
      Name: cloudformationMacro
```

---

<a name = "template2"></a>
##### template2 (template that uses the custom macro)

```json
{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description": "A description to help identify the purpose of the template",
  "Transform": ["cloudformationMacro"]
}
```
```yml
---
AWSTemplateFormatVersion: "2010-09-09"
Description: "A description to help identify the purpose of the template"
Transform: ["cloudformationMacro"]
```
