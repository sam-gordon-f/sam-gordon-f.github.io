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

1) [Template](#template)
2) [Permissions - Deployment Account](#permissions-parent)
2) [Permissions - Child Account](#permissions-child)

---

<a name = "template"></a>
##### 1) Template

The below names a role (backdoor) and allows a specified account (via parameter), access to assume

```json
{
  "Parameters": {
    "accountIdBreakglass": {
      "Type": "String",
      "Default": "123456789123"
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
        ],
        "Path": "/stackset/"
      }
    }
  }
}
```

<br>

<a name = "permissions-parent"></a>
###### 2) Permissions (Deployment Account)

When you run the stackset you need to specify a role to use similar to the below

```json
{
  "Parameters": {
    "accountIdBreakglass": {
      "Type": "String",
      "Default": "123456789123"
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
        ],
        "Path": "/stackset/"
      }
    }
  }
}
```


<br>

<a name = "permissions-child"></a>
###### 3) Permissions (Child Account)
