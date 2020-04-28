---
layout: post
title: "Parameters - dynamic"
date: 2020-02-06 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Dynamic in template replacements
tags: [cloudformation, parameters, yml, json]
skill: intermediate
docs:
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html
\">AWS docs on dynamc resolves here</a>"
---

Dynamic Resolves are a way of having cloudformation `lookup` values when your template is run through a create/update operation.

The source (service) for the value can currently be from

> ssm: Systems Manager Parameter Store plaintext parameter.<br>
> ssm-secure: Systems Manager Parameter Store secure string parameter.<br>
> secretsmanager: AWS Secrets Manager secret.

For example, if i have the following ssm parameter defined (similar to the previous example)

```json
{
  "Resources": {
    "paramA": {
      "Type": "AWS::SSM::Parameter",
      "Properties": {
        "Name": "paramA",
        "Type": "String",
        "Value": "https://integrationServiceA.com"
      }
    }
  }
}
```

then i can use `resolves` instead to look them up.
(the below will lookup version `1` of the parameter `paramA`)

```json
{
  "Resources": {
    "LambdaFunction": {
      "Type": "AWS::Lambda::Function",
      "Properties": {
        "Environment": {
          "Variables": {
            "propertyA": "\{{resolve:paramA:1\}}"
          }
        }
      }
    }
  }
}
```
