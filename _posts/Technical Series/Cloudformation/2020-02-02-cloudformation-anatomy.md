---
layout: post
title: "Template Anatomy"
date: 2020-02-02 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Cloudformation template anatomy
tags: [cloudformation, anatomy]
---

[AWS docs](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html)

Below is a sample template to highlight each of the areas that make up a cloudformation template

---

<pre>
  test
</pre>

```json
{
  "AWSTemplateFormatVersion" : "2010-09-09 (only available version)",
  "Description" : "A description to help identify the purpose of the template",
  "Transform" : [
    "transformName1",
    "..."
  ],
  "Metadata" : {
    template metadata
  },
  "Parameters" : {
    "param1": {
      "Type": "String",
      "AllowedValues": ["first", "second", "third"],
      "Default": "first"
    }
  },
  "Mappings" : {
    "mapping1" : {
      "mappingPropLevel1" : {
        "mappingPropName" : "mappingPropValue"
      }
    }
  },
  "Conditions" : {
    "condition1CheckParam1IsSetToSecond" : {
      "Fn::Equals" : [
        {"Ref" : "param1"},
        "second"
      ]
    }
  },
  "Resources" : {
    "resource1": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "AccessControl": "Private"
      }
    }
  },
  "Outputs" : {
    "output1": {
      "Value": {
        "Ref": "resource1"
      },
      "Name": "resource1LogicalId",
      "Export": "export1"
    }
  }
}
```

---
