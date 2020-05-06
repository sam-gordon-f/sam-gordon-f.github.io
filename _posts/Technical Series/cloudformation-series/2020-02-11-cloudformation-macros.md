---
layout: post
title: Macros
date: 2020-02-11 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Transforms for cloudformation templates
tags: [cloudformation, transform, lambda, macro]
docs:
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-macros.html\">AWS docs on cloudformation Macros</a>"
skill: intermediate
---

Cloudformation Macros are a way to define lambda backed functionality to run against your cloudformation templates. They can be used to model all sorts of crazy scenarios, and remove the previous imposed limits.

The Following are the two ways that you can reference in your templates

1. [Header](#header)
2. [Inline](#inline)

---

<a name="header"></a>
##### 1) Header

Defined at heading level of your template. This gives the entire template to cloudformation, and allows for full fragment replacements

In this example our macro would take the entire template, and could potentially return anything in exchange.
`This is useful for auto-generating resources`

```json
{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description": "A description to help identify the purpose of the template",
  "Transform": ["transformName1"]
}
```

```yml
---
AWSTemplateFormatVersion: "2010-09-09"
Description: "A description to help identify the purpose of the template"
Transform: ["transformName1"]
```

<br>

<a name="inline"></a>
##### 2) Inline

Defined at a specific part of your template. This means that the expecting return fragment has to fit where its placed

In this example we're expecting our macro to return a value for the property `AccessControl` inside our bucket.
This is useful for dynamic property values, or even creating blocks on the fly

```json
{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description": "A description to help identify the purpose of the template",
  "Resources": {
    "resource1": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "AccessControl": {
          "Fn::Transform" : {
            "Name" : "transformName1",
            "Parameters" : {
              "macroParam1" : "macroValue1"
            }
          }
        }
      }
    }
  }
}
```

```yml
---
AWSTemplateFormatVersion: "2010-09-09"
Description: "A description to help identify the purpose of the template"
Resources:
  resource1:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl:
        'Fn::Transform':
          Name: 'transformName1'
          Parameters:
            macroParam1: 'macroValue1'
```
