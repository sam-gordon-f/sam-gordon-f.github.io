---
layout: post
title: Examples - Non Supported Resource
date: 2020-02-02 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: create / reference an identity provider in cloudformation
tags: [cloudformation, lambda, macro]
skill: expert
---

The below example creates a custom resource that manages the lifecycle of a non-cloudformation supported resource (identity provider)

1. [Lambda code (nodejs) - Manages the identity provider](#javascript)
2. [Template1 - template that creates / references the identity provider](#template1)

---

<a name = "javascript"></a>
##### Lambda code - nodejs (manages the lifecycle for the identity provider)

```javascript
var AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION;

var CFN_RESPONSE = require('cfn-response');
var IAM = new AWS.IAM();
var HTTPS = require('https');

  // retry delay
const timer = 5000;

  // function to get metadata from identity platform
var getMetadataFromUrl = function(params) {
  return new Promise(
    function (resolve, reject) {
      HTTPS.get(`${params.metadataUrl}`, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
          data += chunk;
        });

        resp.on('end', () => {
          resolve(data)
        });

      }).on("error", (err) => {
        reject(err)
      });
    }
  )
}

  // placeholder function for checking params
var validateParams = function(params) {
  return new Promise(
    function (resolve, reject) {
      resolve({
        status: true
      });
    }
  );
}

  // waiter loop to make sure that the provider is created successfully
var createLoop = function(IDP, resolve, reject) {
  setTimeout(function() {
      
    IAM.getSAMLProvider({
      SAMLProviderArn: IDP.arn
    }, function(err, data) {
      if(!err)
        resolve(IDP)
      else {
        createLoop(IDP, resolve, reject)
      }        
    })
  }, timer);
}
  
  // waiter loop to make sure that the provider is deleted successfully
var deleteLoop = function(IDP, resolve, reject) {
  setTimeout(function() {
    IAM.getSAMLProvider({
      SAMLProviderArn: IDP.arn
    }, function(err, data) {
      if(err) {
        console.log(`deleteLoop - ${err}`)
        if(err["NoSuchEntity"] === undefined)
          resolve(IDP)
        else
          reject(err)
      } else
        deleteLoop(IDP, resolve, reject)
    })
  }, timer);
}

  // handler for create events
var createIDP = function(params) {
  return new Promise(
    function (resolve, reject) {
      getMetadataFromUrl({
        metadataUrl: params.ResourceProperties.MetadataUrl
      }).
        then(function(resp) {
          IAM.createSAMLProvider({
            Name: params.ResourceProperties.Name,
            SAMLMetadataDocument: resp
          }, function(err, data) {
            if (err) {
              if(err.code == 'EntityAlreadyExists')
                resolve({
                  name: params.ResourceProperties.Name,
                  arn: `arn:aws:iam::${params.ResourceProperties.AccountId}:saml-provider/${params.ResourceProperties.Name}`
                })
              else
                reject({error:err});

            } else
              createLoop({
                  name: params.ResourceProperties.Name,
                  arn: data.SAMLProviderArn
                },
                resolve,
                reject
              );
          });
        })
    }
  )
}

  // handler for delete events
var deleteIDP = function(params) {
  return new Promise(
    function (resolve, reject) {
      IAM.deleteSAMLProvider({
        SAMLProviderArn: params.PhysicalResourceId
      }, function(err, data) {
        if (err)
          reject(err);
        else
          deleteLoop(
            {
              arn: params.PhysicalResourceId,
              name: params.ResourceProperties.Name
            },
            resolve,
            reject
          );
      });
    }
  )
}

  // handler for update events
var updateIDP = function(params) {
  return new Promise(
    function (resolve, reject) {
      getMetadataFromUrl({
        metadataUrl: params.ResourceProperties.MetadataUrl
      }).
        then(function(resp) {
          IAM.updateSAMLProvider({
            SAMLProviderArn: params.PhysicalResourceId,
            SAMLMetadataDocument: resp
          }, function(err, data) {
              if (err)
                reject({error:err});
              else
                resolve({
                  arn: params.PhysicalResourceId,
                  name: params.ResourceProperties.Name
                });
          });
        })
    }
  )
}

exports.handler = (event, context, callback) => {
  validateParams(event).
    then(function(resp) {
      switch(event.RequestType) {
        case 'Create': {
          return createIDP(event);
        }
        case 'Update': {
          return updateIDP(event);
        }
        case 'Delete': {
          return deleteIDP(event);
        }
      }
    }).
    then(function(resp) {
      console.log(`success: ${JSON.stringify(resp)}`);
      CFN_RESPONSE.send(event, context, CFN_RESPONSE.SUCCESS, resp);
    }).
    catch(function(err) {
      console.log(`error: ${JSON.stringify(err.error)}`);
      CFN_RESPONSE.send(event, context, CFN_RESPONSE.FAILED, err);
    });
}

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
              "IDPName": "<<identityProviderName>>"
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
