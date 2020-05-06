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

<a name = "deployments"></a>
##### 4) Deploymemnt

Now that we have all the pieces. The steps are

> navigate to cloudformation
> select stacksets
> select create
> specify account list
> specify deployment role (step 2)
> specify target role (step 3)
> select run
