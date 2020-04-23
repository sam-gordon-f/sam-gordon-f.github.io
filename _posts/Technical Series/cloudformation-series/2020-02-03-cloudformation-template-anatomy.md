---
layout: post
title: "Template Anatomy"
date: 2020-02-02 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Cloudformation template dissection / anatomy
tags: [cloudformation, anatomy]
docs:
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html\">AWS docs on cloudformation template components</a>"
tips:
  - "I've used <a href = \"https://github.com/awslabs/aws-cfn-template-flip\">cfn-flip</a> to provide my examples in both formats (super handy)"
skill: novice

---

Below are each of the major components that make up a cloudformation template.

1. [AWSTemplateFormatVersion](#aws-template-format-version)
2. [Description](#description)
3. [Macros (transforms)](#macros) <span style = "color:orange">* </span>
4. [Parameters](#parameters)
  a. [Referencing](#parameters-referencing)
5. [Metadata](#metadata) <span style = "color:orange">* </span>
6. [Mappings](#mappings) <span style = "color:orange">* </span>
  a. [Referencing](#mappings-referencing)
7. [Conditions](#conditions) <span style = "color:orange">* </span>
  a. [Using at Property Level](#conditions-property-level)
  b. [Using at Resource Level](#conditions-resource-level)
8. [Resources](#resources)
  a. [Referencing](#resources-referencing)
  b. [Properties](#resources-properties)
9. [Outputs](#outputs) <span style = "color:orange">* </span>
  a. [Exports](#outputs-exports)
10. [Full Examples](#full-examples)

<span style = "color:orange">* optional</span>

---

#### AWSTemplateFormatVersion<a name="aws-template-format-version"></a>

Identifies the structure and supported capabilities. [2010-09-09](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/format-version-structure.html) is currently the only version available

```json
{
  "AWSTemplateFormatVersion" : "2010-09-09"
}
```  
```yml
AWSTemplateFormatVersion: "2010-09-09"
```  

---

#### Description<a name="description"></a>

Is used to help viewers identify the purpose of the template

```json
{
  "Description" : "A description to help identify the purpose of the template"
}
```  
```yml
Description: "A description to help identify the purpose of the template"
```

---

#### Macros<a name="macros"></a> <span style = "color:orange">* </span>

Are a directive for cloudformation (at runtime) to take the entirety of whats supplied and run through one or more custom, or AWS managed transforms. These can be defined in the header (as shown) for full template transforms, or inline (more details later).

In the below example, there are the following sample transforms defined.

> "transform1"
which is a custom user defined transform (details [here]({{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-macros-custom))

> "AWS::Serverless"
which is an AWS defined transform for creating lambda functions (details [here]({{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-macros-serverless))

> "AWS::Include"
which is an AWS defined transform for pulling in cloudformation snippets from S3 (details [here]({{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-macros-include))

```json
{
  "Transform" : [
    "transform1",
    "AWS::Serverless",
    "AWS::Include"
  ]
}
```  
```yml
Transform: ["transform", "AWS::Serverless", "AWS::Include"]
```

---

#### Parameters<a name="parameters"></a>

Are a way of creating dynamic inputs for your stacks. These are placeholder definitions for what the user/system can provide to cloudformation at runtime operationa

```json
{
  "Parameters" : {
    "param1": {
      "Type": "String",
      "AllowedValues": ["first", "second", "third"],
      "Default": "first"
    }
  }
}
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

<a name="parameters-referencing"></a>
##### Referencing

```json
{
  "Ref" : "param1"
}
```
```yml
!Ref 'param1'
```

---

#### Metadata<a name="metadata"></a> <span style = "color:orange">* </span>

Can be for storing custom information about your stack and/or some reserved directives. 3 sections described below

> "AWS::CloudFormation::Designer"
Used by the Cloudformation Designer to store meta about where resources reside on the map

> "AWS::CloudFormation::Init"
Used by cfn-init to bootstrap EC2 Instances

> "AWS::CloudFormation::Interface"
Used to help prettify cloudformation/service catalog operation interfaces (create / update)

```json
{
  "Metadata" : {
    "Instances" : {"Description" : "Information about the instances"},
    "Databases" : {"Description" : "Information about the databases"},
    "AWS::CloudFormation::Designer": {},
    "AWS::CloudFormation::Init": {},
    "AWS::CloudFormation::Interface": {
      "ParameterGroups": [{
        "Label": {
          "default": "Custom Parameter Group1"
        },
        "Parameters": ["param1"]
      }],
      "ParameterLabels": [{
        "param1": {
          "default": "Here is a custom description for param1"
        }
      }]
    }
  }
}
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

---

#### Mappings<a name="mappings"></a> <span style = "color:orange">* </span>

Ways of defining config for within templates. These can be dynamically referenced using intrinsic functions paired with 'Parameters'

```json
{
  "Mappings" : {
    "mapping1" : {
      "mappingPropCategory1" : {
        "mappingPropName" : "mappingPropValue"
      },
      "mappingPropCategory2" : {
        "mappingPropName" : "mappingPropValue2"
      }
    }
  }
}
```  

```yml
Mappings:
  mapping1:
    mappingPropCategory1:
      mappingPropName: mappingPropValue
    mappingPropCategory2:
      mappingPropName: mappingPropValue2
```

<a name="mappings-referencing"></a>
##### Referencing

See <a href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-intrinsic-functions#findinmap">intrinsic-functions</a> for more information interogating maps

```json
{
  "Fn::FindInMap" : [
    "mapping1",
    "mappingPropCategory1",
    "mappingPropName"
  ]
}
```
```yml
!FindInMap
- mapping1
- mappingPropCategory1
- mappingPropName
```

---

#### Conditions<a name="conditions"></a> <span style = "color:orange">* </span>

A way of creating logic around property values, and/or cloudformation resource configuration. Mainly used for checking null values and helping your template work with them.

More information and examples at the [aws docs](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html)

```json
{
  "Conditions" : {
    "condition1CheckParam1IsSetToSecond" : {
      "Fn::Equals" : [
        {"Ref" : "param1"},
        "second"
      ]
    }
  }
}
```  

```yml
Conditions:
  condition1CheckParam1IsSetToSecond:
    !Equals: [!Ref param1, second]
```

<a name="conditions-property-level"></a>
##### Conditions at property level
(if condition true, return the text '1234', else null value)

```json
{
  "Fn::If" : [
    "condition1CheckParam1IsSetToSecond",
    "true",
    {
      "Ref": "AWS::NoValue"
    }
  ]
}
```
```yml
!If
- condition1CheckParam1IsSetToSecond
- 'true'
- !Ref 'AWS::NoValue'
```
<a name="conditions-resource-level"></a>
##### Conditions at resource level
(if condition true, create the resources, else do not create)

```json
{
  "Resources" : {
    "resource1": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "AccessControl": "Private"
      },
      "Condition": "condition1CheckParam1IsSetToSecond"
    }
  }
}
```
```yml
Resources:
  resource1:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: "Private"
    Condition: "condition1CheckParam1IsSetToSecond"
```
---

#### Resources<a name="resources"></a>

The contents(resources) to be contained within your stack. Typically each resource is denoted by one logical ID (what the template specifies as the JSON/YML key).

See <a href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-resources">here</a> for more information on resources

```json
{
  "Resources" : {
    "resource1": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "AccessControl": "Private"
      }
    }
  }
}
```  
```yml
Resources:
  resource1:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: "Private"
```

<a name="resources-reference"></a>
##### Referencing

See <a href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-intrinsic-functions#ref">here</a> for more information on `Ref`

```json
{
  "Ref" : "resource1"
}
```
```yml
!Ref 'resource1'
```

<a name="resources-properties"></a>
##### Properties

See <a href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-intrinsic-functions#getatt">here</a> for more information on `GetAtt`

```json
{
  "Fn::GetAtt" : [
    "resource1",
    "Arn"
  ]
}
```
```yml
!GetAtt 'resource1.Arn'
```

---

#### Outputs <a name="outputs"></a> <span style = "color:orange">* </span>
 
A list of values that you wish to make available for viewers. These can also be exposed as exports (as optionally shown below)

<div class="card tip">
  <div class="card-body">
    When using exports. Each one must have a `region specific unique key`. So a good naming convention is to use the stack name (as show below)
  </div>
</div>

```json
{
  "Outputs" : {
    "output1": {
      "Description": "Here is the default value when referencing an S3 Bucket",
      "Value": {
        "Ref": "resource1"
      },
      "Name": "resource1LogicalId",
      "Export": {
        "Fn::Join": ["-", [
          {
            "Ref": "AWS::StackName"
          },
          "export1"
        ]]
      }
    }
  }
}
```
```yml
Outputs:
  output1:
    Description: Here is the default value when referencing an S3 Bucket
    Value: !Ref 'resource1'
    Name: resource1LogicalId
    Export: !Join
      - '-'
      - - !Ref 'AWS::StackName'
        - export1
```

<a name="outputs-exports"></a>
##### Exports

The below example is referening an export defined in the above example

See <a href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-intrinsic-functions#importvalue">here</a> for more information on `ImportValue`</a>

```json
{
  "Fn::ImportValue" : "<<stackName>>-export1"
}
```
```yml
!ImportValue '<<stackName>>-export1'
```

---

#### Full Examples<a name="full-examples"></a>

The full template examples are here (some properties omitted as their have dependencies)

```json
{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description": "A description to help identify the purpose of the template",
  "Parameters" : {
    "param1": {
      "Type": "String",
      "AllowedValues": ["first", "second", "third"],
      "Default": "first"
    }
  },
  "Metadata" : {
    "AWS::CloudFormation::Interface": {
      "ParameterGroups": [{
        "Label": {
          "default": "Custom Parameter Group1"
        },
        "Parameters": ["param1"]
      }],
      "ParameterLabels": [{
        "param1": {
          "default": "Here is a custom description for param1"
        }
      }]
    }
  },
  "Mappings" : {
    "mapping1" : {
      "mappingPropCategory1" : {
        "mappingPropName" : "mappingPropValue"
      },
      "mappingPropCategory2" : {
        "mappingPropName" : "mappingPropValue2"
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
---
AWSTemplateFormatVersion: '2010-09-09'
Description: A description to help identify the purpose of the template
Parameters:
  param1:
    Type: String
    AllowedValues:
      - first
      - second
      - third
    Default: first
Metadata:
  AWS::CloudFormation::Interface:
    ParameterGroups:
      - Label:
          default: Custom Parameter Group1
        Parameters:
          - param1
    ParameterLabels:
      - param1:
          default: Here is a custom description for param1
Mappings:
  mapping1:
    mappingPropCategory1:
      mappingPropName: mappingPropValue
    mappingPropCategory2:
      mappingPropName: mappingPropValue2
Conditions:
  condition1CheckParam1IsSetToSecond: !Equals
    - !Ref 'param1'
    - second
Resources:
  resource1:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: Private
Outputs:
  output1:
    Description: Here is the default value when referencing an S3 Bucket
    Value: !Ref 'resource1'
    Name: resource1LogicalId
    Export: export1
```
