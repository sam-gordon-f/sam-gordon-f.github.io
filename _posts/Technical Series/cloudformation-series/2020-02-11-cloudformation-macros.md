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
tips:
  - "Macros can be referenced in two ways in your template. They are both listed below"
skill: intermediate
---

Cloudformation Macros are a way to define lambda backed functionality to run against your cloudformation templates. They can be used to model all sorts of crazy scenarios, and remove the previous imposed limits.
  <br>
  <br>
The Following are the two ways that you can reference in your templates

1. [Header](#header)
2. [Inline](#inline)

---

<a name="header"></a>
Example 1 - defined at heading level<br>
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

---

<a name="inline"></a>
example 2 - defined at specific point<br>
In this example we're expecting our macro to return a value for the property `AccessControl` inside our bucket.
`This is useful for dynamic property values`

See

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
