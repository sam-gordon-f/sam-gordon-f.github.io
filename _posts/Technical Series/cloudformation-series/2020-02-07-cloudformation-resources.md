---
layout: post
title: "Resources"
date: 2020-02-07 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Resources contained within a cloudformation template/stack
tags: [cloudformation, parameters, yml, json]
docs:
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html\">AWS docs on cloudformation resources</a>"
skill: novice
---

Every logical resource inside your cloudformation template supports, and in some cases requires the following

##### Resource Blocks
1. [Type](#type)
2. [Properties](#properties)
3. [Retention Policies](#retention-policies) <span style = "color:orange">* </span>
4. [Conditions](#conditions) <span style = "color:orange">* </span>
5. [DependsOn](#depends-on) <span style = "color:orange">* </span>

<span style = "color:orange">* </span> optional

---

<a name = "type"></a>
#### 1) Type

Each resource has a `Type`, this declares to cloudformation what you're intending on creating alongside what properties are supported.
Refer to the docs above as your bible for what resources are supported

```json
{
  "Resources": {
    "Type": "AWS::Apigateway::Resource"
  }
}
```

<br>

<a name = "properties"></a>
#### 2) Properties

As every resource type in AWS is completely different, there are a myriad of properties supported.
Refer to the docs above as your bible for what properties are supported against each resource type

```json
{
  "Resources": {
    "Type": "AWS::Apigateway::Resource",
    "Properties": {
      "PathPart": "/test"
    }
  }
}
```

<br>

<a name = "retention-policies"></a>
#### 3) Retention Policies

These are directives for what to do when certain operations are executed on a stack.

For example- The below keeps an S3 bucket if a `stackDelete` operation is run

```json
{
  "Resources": {
    "S3Bucket": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "AccessControl": "Private"
      },
      "DeletionPolicy": "Retain"
    }
  }
}
```

This is super handy for when you resource that in turn store data (S3, RDS, Elasticache, Redshift, etc...)

<br>

<a name = "conditions"></a>
#### 4) Conditions

Conditions are a way to determine which resources are / are not created based on parameters that you pass

For example- The below only creates a bucket if `param1` == true

```json
{
  "Parameters": {
    "param1": {
      "Type": "String",
      "AllowedValues": [
        "true",
        "false"
      ]
    }
  },
  "Conditions": {
    "conditionCreateBucket": {
      "Fn::Equals": [
        {
          "Ref": "param1"
        },
        "true"
      ]
    }
  },
  "Resources": {
    "S3Bucket": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "AccessControl": "Private"
      },
      "DeletionPolicy": "Retain",
      "Condition": "conditionCreateBucket"
    }
  }
}
```

This allows you to create stacks that dynamically create based on user input.

<br>

<a name = "depends-on"></a>
#### 5) DependsOn

This is a directive to chain the order of creation for your resources. Somewhat superfluious as `Ref` tends to do it for you.
However there are a number of situations that will have you scratching your head for ages if you dont learn to factor this in

For example- The below defines a lambda function that will run in a VPC, and the permissions it requires to operate in such a fashion

```json
{
  "Parameters": {
    "EC2SecurityGroupId": {
      "Type": "AWS::EC2::SecurityGroup::Id"
    },
    "ListEC2SubnetId": {
      "Type": "List<AWS::EC2::Subnet::Id>"
    }
  },
  "Resources": {
    "IAMRole": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [{
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
              "Service": "lambda.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
          }]
        }
      }
    },
    "IAMPolicy": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyName": {
          "Fn::Join": ["-", [{"Ref": "AWS::StackName"}, "lambda"]]
        },
        "PolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [{
            "Effect": "Allow",
            "Action": [
              "ec2:CreateNetworkInterface",
              "ec2:DescribeNetworkInterfaces",
              "ec2:DeleteNetworkInterface"
            ],
            "Resource": ["*"]
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
        "Role": {
          "Ref": "IAMRole"
        },
        "VpcConfig": {
          "SecurityGroupIds": [{
            "Ref": "EC2SecurityGroupId"
          }],
          "SubnetIds" : {
            "Ref": "ListEC2SubnetId"
          }
        }
      },
      "DependsOn": ["IAMPolicy"]
    }
  }
}
```

In the above, the lambda function `will not` successfully create until is has permissions to create eni's.
So we're explicitly telling the function to wait until the permissions are attached to the role its to use
