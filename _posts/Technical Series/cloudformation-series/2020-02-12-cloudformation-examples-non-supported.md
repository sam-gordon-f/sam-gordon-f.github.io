---
layout: post
title: Examples - Non Supported Resource
date: 2020-02-02 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: create / reference an identity provider in cloudformation
tags: [cloudformation, lambda, macro]
prevPost:
  text: "Examples - Dynamic Config"
  link: "/technical-series/cloudformation-series/cloudformation-examples-dynamic-config"
skill: expert
---

1. [Lambda code (nodejs) - Manages the identity provider](#javascript)
2. [Template1 - template that creates / references the identity provider](#template1)

---

<a name = "javascript"></a>
##### Lambda code - nodejs (Advertises the custom config)

```javascript
exports.handler = (event, context, callback) => {
  var fragment = event.fragment;


    // This entry is coming
};
```

---

<a name = "template1"></a>
##### template1 (template that creates / references the identity provider)

In the below we create a custom resource that represents an identity provider, then
an IAM Role which references this for the trust policy (allowing login from the SAML endpoint)

```json
{
  "Resources": {
    "IAMRole": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"lambda.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}",
        "ManagedPolicyArns": [
          "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess",
          "arn:aws:iam::aws:policy/AWSXrayWriteOnlyAccess"
        ]
      }
    },
    "IAMPolicy": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyName": {
          "Fn::Join": ["-", ["example", "non", "supported", "resource"]]
        },
        "PolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [{
            "Effect": "Allow",
            "Resource": ["*"],
            "Action": [
              "iam:UpdateSamlProvider",
              "iam:CreateSamlProvider",
              "iam:DeleteSamlProvider",
              "iam:GetSamlProvider"
            ]
          }]
        },
        "Roles": [{
          "Ref": "IAMRole"
        }]
      }
    },
    "LambdaFunction": {
      "Type": "AWS::Lambda::Function",
      "Properties": {
        "Handler": "index.handler",
        "Runtime": "nodejs10.x",
        "Code": {
          "S3Bucket": "<<bucketNameForAboveLambdaZip>>",
          "S3Key": "<<bucketkeyForAboveLambdaZip>>"
        },
        "Role": {
          "Fn::GetAtt": ["IAMRole", "Arn"]
        },
        "Description": "custom resource lambda for managing idps",
        "MemorySize": 128,
        "Timeout": 20,
        "TracingConfig": {
          "Mode": "Active"
        }
      },
      "DependsOn": ["IAMPolicy"]
    },
    "customResource": {
      "Type": "Custom::IdentityProvider",
      "Properties": {
        "Version": "1.0",
        "ServiceToken": {
          "Fn::GetAtt": ["LambdaFunction", "Arn"]
        },
        "Name": "<<identityProviderName>>",
        "MetadataUrl": "<<identityProviderMetaUrl>>",
        "AccountId": {
          "Ref": "AWS::AccountId"
        }
      }
    },
    "IAMRoleAssumeFromSAML": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Fn::Sub": [
            "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"federated\",\"Effect\":\"Allow\",\"Principal\":{\"Federated\":\"arn:aws:iam::${accountId}:saml-provider/${IDPName}\"},\"Action\":\"sts:AssumeRoleWithSAML\",\"Condition\":{\"StringEquals\":{\"SAML:aud\":\"https://signin.aws.amazon.com/saml\"}}}]}",
            {
              "accountId": {
                "Ref": "AWS::AccountId"
              },
              "IDPName": "federation"
            }
          ]
        },
        "RoleName": "AssumeFromSAML",
        "ManagedPolicyArns": [
          "arn:aws:iam::aws:policy/AdministratorAccess",
          "arn:aws:iam::aws:policy/job-function/SupportUser"
        ],
        "MaxSessionDuration": 28800
      }
    }
  }
}
```
```yml
---
Resources:
  IAMRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument: '{"Version":"2012-10-17","Statement":[{"Sid":"","Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/CloudWatchLogsFullAccess
        - arn:aws:iam::aws:policy/AWSXrayWriteOnlyAccess
  IAMPolicy:
    Type: AWS::IAM::Policy
    Properties:
      PolicyName: !Join
        - '-'
        - - example
          - non
          - supported
          - resource
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Resource:
              - '*'
            Action:
              - iam:UpdateSamlProvider
              - iam:CreateSamlProvider
              - iam:DeleteSamlProvider
              - iam:GetSamlProvider
      Roles:
        - !Ref 'IAMRole'
  LambdaFunction:
    Type: AWS::Lambda::Function
    Properties:
      Handler: index.handler
      Runtime: nodejs10.x
      Code:
        S3Bucket: <<bucketNameForAboveLambdaZip>>
        S3Key: <<bucketkeyForAboveLambdaZip>>
      Role: !GetAtt 'IAMRole.Arn'
      Description: custom resource lambda for managing idps
      MemorySize: 128
      Timeout: 20
      TracingConfig:
        Mode: Active
    DependsOn:
      - IAMPolicy
  customResource:
    Type: Custom::IdentityProvider
    Properties:
      Version: '1.0'
      ServiceToken: !GetAtt 'LambdaFunction.Arn'
      Name: <<identityProviderName>>
      MetadataUrl: <<identityProviderMetaUrl>>
      AccountId: !Ref 'AWS::AccountId'
  IAMRoleAssumeFromSAML:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument: !Sub
        - >-
          {"Version":"2012-10-17","Statement":[{"Sid":"federated","Effect":"Allow","Principal":{"Federated":"arn:aws:iam::${accountId}:saml-provider/${IDPName}"},"Action":"sts:AssumeRoleWithSAML","Condition":{"StringEquals":{"SAML:aud":"https://signin.aws.amazon.com/saml"}}}]}
        - accountId: !Ref 'AWS::AccountId'
          IDPName: federation
      RoleName: AssumeFromSAML
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/AdministratorAccess
        - arn:aws:iam::aws:policy/job-function/SupportUser
      MaxSessionDuration: 28800
```
