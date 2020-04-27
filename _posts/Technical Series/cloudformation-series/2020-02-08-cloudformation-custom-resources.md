---
layout: post
title: Custom Resources
date: 2020-02-08 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: A means to define non-cloudformation standard resources
tags: [cloudformation, custom, resources, nodejs]
docs:
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html\">AWS docs on custom resources</a>"
skill: proficient
tips:
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-lambda-function-code-cfnresponsemodule.html\">cfn-response</a> Is a great module (nodejs/python) for sending the lambda responses back to cloudformation (as the example will show)"
---

Custom Resources are a way to define non-cloudformation standard resources. Think of them like a shell that invokes / contains the response from a lambda function

For example - At the time of writing this cloudformation did not have support for enabling shieldAdvanced subscriptions in your account. The below are the required pieces to achieve it via custom resources

1. [Javascript (nodeJS)](#javascript)
2. [Cloudformation Template](#cloudformation)
3. [How it all fits](#diagram)

---

#### Javascript <a name="javascript"></a>

This is a custom lambda function written in nodejs that will handle the subscription creation/deletion when invoked in the correct fashion (via a custom resource in this case)

```javascript
  // include the main SDK
var AWS = require("aws-sdk");

  // as mentioned in the tip above
var CFN_RESPONSE = require("cfn-response");

  // create an AWS Shield Constructor
var SHIELD = new AWS.Shield();
  
  // as shield advanced runs out of us-east-1
AWS.config.region = "us-east-1";
  
  // handler function for cloudformation create/updates
var shieldEnable = function(params) {    
     return new Promise(
        function (resolve, reject) {
            SHIELD.createSubscription({
              // no params required
            }, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        }
    )
}

  // handler function for cloudformation deletes
var shieldDisable = function(params) {    
     return new Promise(
        function (resolve, reject) {
            SHIELD.deleteSubscription({
              // no params required
            }, function(err, data) {                
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        }
    )
}

  // handler function for validating params passed *optional
  // I tend to use this as a wrapper for all my custom resource code
var validateParams = function(params) {
    return new Promise(
        function (resolve, reject) {
            resolve({
                status: true
            });
        }
    );
}

exports.handler = (event, context, callback) => {    
      
      // check the params passed before executing anything
    validateParams(event).
        then(function(resp) {
  
              // switch for each cloudformation event type
            switch(event.RequestType) {
                case "Create": {
                    return shieldEnable(event);
                }
                case "Update": {
                    return shieldEnable(event);
                }
                case "Delete": {
                    return shieldDisable(event);
                }
            }
        }).
          // if successful
        then(function(resp) {            
            CFN_RESPONSE.send(
              event,
              context,
              CFN_RESPONSE.SUCCESS,
              resp
            );
            callback(null, resp);
        }).
          // if exception
        catch(function(err) {
              
              // if subscription exists, return success
            if(err.code == "LockedSubscriptionException" ||
                err.code == "ResourceAlreadyExistsException") {
                    CFN_RESPONSE.send(
                      event,
                      context,
                      CFN_RESPONSE.SUCCESS,
                      err
                    );
                    callback(null, cfn_response);
                
              // else return the error to cloudformatioh
            } else {
                CFN_RESPONSE.send(
                  event,
                  context,
                  CFN_RESPONSE.FAILED,
                  err
                );
                callback(err, err.message);
            }
        });
}
```

---

#### Cloudformation <a name="cloudformation"></a>

This is a custom cloudformation template that will invoke the above function as assign to a custom construct. It has a number of resources

1. An IAM role for the lambda function to invoke with
2. An IAM policy to attach to the aforementioned role
3. A lambda function definition (custom resource javascript)
4. A CustomResource to invoke and store state of the javascript invocation

```json
{
  "Resources": {
    "IAMRoleCustomResource": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"lambda.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}",
        "ManagedPolicyArns": ["arn:aws:iam::aws:policy/CloudWatchLogsFullAccess", "arn:aws:iam::aws:policy/AWSXrayWriteOnlyAccess"]
      }
    },
    "IAMPolicyCustomResource": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyName": "IAMPolicyCustomResource",
        "PolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [{
            "Effect": "Allow",
            "Action": ["shield:CreateSubscription", "shield:DeleteSubscription"],
            "Resource": ["*"]
          }]
        },
        "Roles": [{
          "Ref": "IAMRoleCustomResource"
        }]
      }
    },
    "LambdaFunctionShieldAdvancedManage": {
      "Type": "AWS::Lambda::Function",
      "Properties": {
        "Handler": "index.handler",
        "Runtime": "nodejs10.x",
        "Code": {
          "S3Bucket": "<<bucketNameToStoreAboveFunctionAsZip>>",
          "S3Key": "<<bucketKeyToStoreAboveFunctionAsZip>>"
        },
        "Role": {
          "Fn::GetAtt": ["IAMRoleCustomResource", "Arn"]
        },
        "Description": "custom resource lambda for managing AWS shield advanced subscriptions",
        "MemorySize": 128,
        "Timeout": 20,
        "TracingConfig": {
          "Mode": "Active"
        }
      },
      "DependsOn": "IAMPolicyShieldAdvancedManage"
    },
    "customShieldAdvancedSubscription": {
      "Type": "Custom::ShieldAdvancedManage",
      "Properties": {
        "Version": "1.0",
        "ServiceToken": {
          "Fn::GetAtt": ["LambdaFunctionShieldAdvancedManage", "Arn"]
        }
      }
    }
  }
}
```
```yml
Resources:
  IAMRoleCustomResource:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument: '{"Version":"2012-10-17","Statement":[{"Sid":"","Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/CloudWatchLogsFullAccess
        - arn:aws:iam::aws:policy/AWSXrayWriteOnlyAccess
  IAMPolicyCustomResource:
    Type: AWS::IAM::Policy
    Properties:
      PolicyName: IAMPolicyCustomResource
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Action:
              - shield:CreateSubscription
              - shield:DeleteSubscription
            Resource:
              - '*'
      Roles:
        - !Ref 'IAMRoleCustomResource'
  LambdaFunctionShieldAdvancedManage:
    Type: AWS::Lambda::Function
    Properties:
      Handler: index.handler
      Runtime: nodejs10.x
      Code:
        S3Bucket: <<bucketNameToStoreAboveFunctionAsZip>>
        S3Key: <<bucketKeyToStoreAboveFunctionAsZip>>
      Role: !GetAtt 'IAMRoleCustomResource.Arn'
      Description: custom resource lambda for managing AWS shield advanced subscriptions
      MemorySize: 128
      Timeout: 20
      TracingConfig:
        Mode: Active
    DependsOn: IAMPolicyShieldAdvancedManage
  customShieldAdvancedSubscription:
    Type: Custom::ShieldAdvancedManage
    Properties:
      Version: '1.0'
      ServiceToken: !GetAtt 'LambdaFunctionShieldAdvancedManage.Arn'
```

---

The below is logically how the pieces fit and reference each other 

<a href="{{ site.baseurl }}/assets/images/technical-series/cloudformation/custom-resources.svg" data-fancybox data-caption="cloudformation-custom-resources">
  <img src="{{ site.baseurl }}/assets/images/technical-series/cloudformation/custom-resources.svg" alt="drawing" style="width:100%;"/>
</a>
