---
layout: post
title: "Template Anatomy"
date: 2020-02-02 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Cloudformation template anatomy
tags: [cloudformation, anatomy]
---

Below is a broken down template, with annotations / links to describe each section. Official Docs [here](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html)

---

```
{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description" : "A description to help identify the purpose of the template",
```  

> [AWSTemplateFormatVersion](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/format-version-structure.html) - Identifies the structure and supported capabilities. 2010-09-09 is currently the only version available

> Description - is used to help viewers identify the purpose of the template

```
  "Transform" : [
    "transformName1"
  ],
```  

> Transform - Is a directive for cloudformation (at runtime) to take the entirety of whats supplied and run through one or more custom, or AWS managed macros.
In the above example, there must be a custom macro (pre-defined lambda function) defined as "transformName1", which will return a result to cloudformation on changeset operations. Futher information [here]({{ site.baseurl }}/technical-series/cloudformation-macros-transform)

```
  "Parameters" : {
    "param1": {
      "Type": "String",
      "AllowedValues": ["first", "second", "third"],
      "Default": "first"
    }
  },
```  

> Parameters - Is a way of creating dynamic inputs for your stacks. These are placeholder definitions for what the user/system can provide

```
  "Metadata" : {
    "Instances" : {"Description" : "Information about the instances"},
    "Databases" : {"Description" : "Information about the databases"}",
    "AWS::CloudFormation::Designer",
    "AWS::CloudFormation::Init",
    "AWS::CloudFormation::Interface": : {
      "ParameterGroups": [{
        "Label": {
          "default": "Custom Parameter Group1"
        },
        "Parameters": ["param1"]
      },
      "ParameterLabels": {
        "param1": {
          "default": "Here is a custom description for param1"
        }
      }
    }
  },
```  

> Metadata - Is for storing custom information about your stack and/or some reserved directives. 3 sections described below

- AWS::CloudFormation::Designer. Used by the Cloudformation Designer to store meta about where resources reside on the map

- AWS::CloudFormation::Init. Used by cfn-init to bootstrap EC2 Instances

- AWS::CloudFormation::Interface. Used to help prettify cloudformation operation interfaces (create / update)

```
  "Mappings" : {
    "mapping1" : {
      "mappingPropLevel1" : {
        "mappingPropName" : "mappingPropValue"
      }
    }
  },
```  

> Mappings - Ways of defining config for your templates. These can be dynamically referenced using intrinsic functions paired with 'Parameters'

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

> Conditions - A way of creating logic around property values, and/or cloudformation resource configuration

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

> Resources - The contents of your stack. Typically each resource is denoted by one logical ID (what the template specifies as the JSON/YML key)

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

> Outputs - A list of values that you wish to make available for vierers. These can also be exposed as exports for other stacks to reference using the intrinsic function Fn::ImportValue


---
