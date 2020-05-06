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

Resolves are a way of having cloudformation `lookup` values when your template is run through a create or update operation.
These are a great way of abstracting some complexity away from the user or systems that interact with them.

Currently there are only a few services that values can be resolved via, and they're listed in the documentation

<div class="card official-docs">
  <div class="card-body">
    <a href = "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html">AWS documentaton on supported resolve services</a>
  </div>
</div>

In the example below, I'll show how you can create a value, and then subsequently resolve it in a different stack

1. [Create the parameter (templateA)](#template-a)
2. [Resolve the parameter (templateB)](#template-b)

---

<a name = "template-a"></a>
##### 1) Create the Parameter (templateA)

I've created the parameter and the value in the below template. This must be run against cloudformation before the subsequent lookup occurs

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

<a name = "template-b"></a>
##### 2) Resolve the value (templateB)

In this template, theres a resolve directive which triggers cloudformation to lookup the value stored in the above SSM::Parameter

```json
{
  "Resources": {
    "LambdaFunction": {
      "Type": "AWS::Lambda::Function",
      "Properties": {
        "Environment": {
          "Variables": {
            "propertyA": "{{resolve:paramA:1}}"
          }
        }
      }
    }
  }
}
```
