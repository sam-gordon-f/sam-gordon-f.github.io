---
layout: post
title: "StackSets"
date: 2020-02-29 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Deployments accross multiple accounts
tags: [cloudformation, parameters, json, stackset]
skill: intermediate
---

Stacksets grant the ability to define a template once, and deploy it across multiple accounts / regions.
This is super useful for creating baselines, or control how your fleet of environments could be reflected.

Say for example I wanted a backdoor role in a number of accounts. I could use the below example

1. [Template](#template)
2. [Permissions - Deployment Account](#permissions-parent)
3. [Permissions - Child Account](#permissions-child)
4. [Deployment](#deployment)

---

<a name = "template"></a>
##### 1) Template

The below names a role (backdoor) and allows a specified backdoor account access to assume.

```json
{
  "Parameters": {
    "accountIdBreakglass": {
      "Type": "String",
      "Default": "555555555555"
    }
  },
  "Resources": {
    "IAMRole": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Version": "2012-10-17",
          "Statement":[{
            "Sid":"breakglass",
            "Effect":"Allow",
            "Principal":{
              "AWS":[
                {
                  "Ref": "accountIdBreakglass"
                }
              ]
            },
            "Action":"sts:AssumeRole"
          }]
        },
        "RoleName": "Backdoor",
        "ManagedPolicyArns": [
          "arn:aws:iam::aws:policy/AdministratorAccess",  
          "arn:aws:iam::aws:policy/job-function/SupportUser"
        ]
      }
    }
  }
}
```

<br>

<a name = "permissions-parent"></a>
##### 2) Permissions (Deployment Account - 123456789123)

When you run the stackset you'll need to specify a role to use.
(This is the principal cloudformation assmues and uses to communicate with the child accounts)

```json
{
  "Resources": {
    "IAMRole": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Version": "2012-10-17",
          "Statement":[{
            "Sid":"stackset",
            "Effect":"Allow",
            "Principal":{
              "AWS":[
                {
                  "Ref": "AWS::AccountId"
                }
              ]
            },
            "Action":"sts:AssumeRole"
          }]
        },
        "RoleName": "Stackset",
        "ManagedPolicyArns": [
          "arn:aws:iam::aws:policy/AdministratorAccess"
        ]
      }
    }
  }
}
```


<br>

<a name = "permissions-child"></a>
##### 3) Permissions (Child Account - 987654321987)

You'll also need a role that lives in the target account(s)
(This is the role that the deployment account assumes in order to create resources)

```json
{
  "Resources": {
    "IAMRole": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Version": "2012-10-17",
          "Statement":[{
            "Sid":"stackset",
            "Effect":"Allow",
            "Principal":{
              "AWS":[
                "arn:aws:iam::123456789123:role/Stackset"
              ]
            },
            "Action":"sts:AssumeRole"
          }]
        },
        "RoleName": "Stackset",
        "ManagedPolicyArns": [
          "arn:aws:iam::aws:policy/AdministratorAccess"
        ]
      }
    }
  }
}
```

<br>

<a name = "deployment"></a>
##### 4) Deployment

Now that we have all the pieces. We can use the API's / CLI to put them all together

```shell
# this creates the stackset container
aws cloudformation create-stack-set \
  --stack-set-name="backdoor" \
  --template-body=file://cloudformation.template \
  --capabilities="CAPABILITY_NAMED_IAM" \
  --administration-role-arn="arn:aws:iam::123456789123:role/Stackset" \
  --execution-role-name="Stackset"

# this adds the accounts that you wish to deploy to
aws cloudformation create-stack-instances \
  --stack-set-name "backdoor" \
  --accounts "987654321987" \
  --regions "ap-southeast-2"
```

<div class="card tip">
  <div class="card-body">
    This is only a basic example - There are a number of other properties that you can use to control things like ordering, target accounts / OU's, etc...
  </div>
</div>
