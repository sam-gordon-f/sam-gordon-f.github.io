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

Below are a number of samples that discuss what each section means

---

```
{
  "AWSTemplateFormatVersion" : "2010-09-09 (only available version)",
  "Description" : "A description to help identify the purpose of the template",
```  
<br>

```
  "Transform" : [
    "transformName1",
    "..."
  ],
```  
<br>

```
  "Metadata" : {
    template metadata
  },
```  
<br>

```
  "Parameters" : {
    "param1": {
      "Type": "String",
      "AllowedValues": ["first", "second", "third"],
      "Default": "first"
    }
  },
```  
<br>

```
  "Mappings" : {
    "mapping1" : {
      "mappingPropLevel1" : {
        "mappingPropName" : "mappingPropValue"
      }
    }
  },
```  
<br>

```
  "Conditions" : {
    "condition1CheckParam1IsSetToSecond" : {
      "Fn::Equals" : [
        {"Ref" : "param1"},
        "second"
      ]
    }
  },
```  
<br>

```
  "Resources" : {
    "resource1": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "AccessControl": "Private"
      }
    }
  },
```  
<br>

```
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
