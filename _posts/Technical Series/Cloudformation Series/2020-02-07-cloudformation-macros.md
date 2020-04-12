---
layout: post
title: Macros
date: 2020-02-02 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Transforms for cloudformation templates
tags: [cloudformation, transform, lambda, macro]
---

<div class="card official-docs">
  <div class="card-body">
    <a href = "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-macros.html">AWS docs on cloudformation Macros</a>
  </div>
</div>

Cloudformation Macros are a way to define lambda backed functionality to run against your cloudformation templates. They can be used to model all sorts of crazy scenarios, and remove the previous imposed limits.

They can used in one of the following two ways

---

example 1 - defined at heading level
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

example 2 - defined at specific point<br>
In this example we're expecting our macro to return a value for the property `AccessControl` inside our bucket.
`This is useful for dynamic property values`

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

<div class="container grid-xl">
  <div class="columns">
    <div class = "column col-3 col-md-4 col-sm-12 col-xs-12">
      <a style="height: auto; width:100%;" class="btn btn-success btn-lg btn-outline py-2 mt-4" href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-custom-resources">Custom Resources</a>
    </div>
    <div class = "column col-6 col-md-4 col-sm-12 col-xs-12">
      
    </div>
    <div class="column col-3 col-md-4 col-sm-12 col-xs-12">
      <a style="height: auto; width:100%;" class="btn btn-success btn-lg btn-outline py-2 mt-4" href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-macros-include">Macros - Include</a>
    </div>
  </div>
</div>
