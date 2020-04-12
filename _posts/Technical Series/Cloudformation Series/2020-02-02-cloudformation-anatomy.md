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

#### Basic Details
```
{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description" : "A description to help identify the purpose of the template",
```  

```yml
---
AWSTemplateFormatVersion: "2010-09-09"
Description: "A description to help identify the purpose of the template"

```  

> [AWSTemplateFormatVersion](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/format-version-structure.html) - Identifies the structure and supported capabilities. 2010-09-09 is currently the only version available

> Description - is used to help viewers identify the purpose of the template

#### Transforms


```
  "Transform" : [
    "transformName1"
  ],
```  

```yml
Transform: [transformName1]
```

Is a directive for cloudformation (at runtime) to take the entirety of whats supplied and run through one or more custom, or AWS managed macros.
In the above example, there must be a custom macro (pre-defined lambda function) defined as "transformName1", which will return a result to cloudformation on changeset operations. Futher information [here]({{ site.baseurl }}/technical-series/cloudformation-macros-transform)

#### Parameters

```
  "Parameters" : {
    "param1": {
      "Type": "String",
      "AllowedValues": ["first", "second", "third"],
      "Default": "first"
    }
  },
```  

```yml
Parameters:
  param1:
    Type: String
    AllowedValues:
      - first
      - second
      - third
    Default: first  
```

Are a way of creating dynamic inputs for your stacks. These are placeholder definitions for what the user/system can provide


#### Metadata

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

```yml
Metadata:
  Instances:
    Description: "Information about the instances"
  Databases:
    Description: "Information about the databases"
  AWS::CloudFormation::Designer:
  AWS::CloudFormation::Init:
  AWS::CloudFormation::Interface:
    ParameterGroups:
      -
        Label:
          default: "Custom Parameter Group1"
        Parameters:
          - param1
    ParameterLabels:
      param1:
        default: "Here is a custom description for param1"
```

Is for storing custom information about your stack and/or some reserved directives. 3 sections described below

- AWS::CloudFormation::Designer. Used by the Cloudformation Designer to store meta about where resources reside on the map

- AWS::CloudFormation::Init. Used by cfn-init to bootstrap EC2 Instances

- AWS::CloudFormation::Interface. Used to help prettify cloudformation operation interfaces (create / update)

#### Mappings

```
  "Mappings" : {
    "mapping1" : {
      "mappingPropLevel1" : {
        "mappingPropName" : "mappingPropValue"
      }
    }
  },
```  

```yml
Mappings:
  mapping1:
    mappingPropLevel1:
      mappingPropName: mappingPropValue
```

Ways of defining config for your templates. These can be dynamically referenced using intrinsic functions paired with 'Parameters'

#### Conditions

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

```yml
Conditions:
  condition1CheckParam1IsSetToSecond:
    Fn::Equals: [!Ref param1, second]
```

A way of creating logic around property values, and/or cloudformation resource configuration

#### Resources

```json
  "Resources" : {
    "resource1": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "AccessControl": "Private"
      }
    }
  },
```  

```yml
Resources:
  resource1:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: "Private"
```

The contents(resources) to be contained within your stack. Typically each resource is denoted by one logical ID (what the template specifies as the JSON/YML key).
See. [Cloudformation template/stack resources]({{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-resources)

#### Outputs / Exports

```
  "Outputs" : {
    "output1": {
      "Description": "Here is the default value when referencing an S3 Bucket",
      "Value": {
        "Ref": "resource1"
      },
      "Name": "resource1LogicalId",
      "Export": "export1"
    }
  }
}
```

```yml
Outputs:
  output1:
    Description: "Here is the default value when referencing an S3 Bucket (logicalId)"
    Value: !Ref resource1
    Name: "resource1LogicalId"
    Export:
      Name: export1
```

A list of values that you wish to make available for vierers. These can also be exposed as exports (`must be unique keys`, and use the directive in the example above)

For other stacks to reference the aforementioned exports, use the intrinsic function [Fn::ImportValue](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html)

```
{ "Fn::ImportValue" : "export1" }
```

```yml
Fn::ImportValue: "export1"
```


---
