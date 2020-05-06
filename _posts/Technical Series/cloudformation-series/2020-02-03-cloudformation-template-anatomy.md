---
layout: post
title: "Template Anatomy"
date: 2020-02-03 08:44:38
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

All templates will have a combination of the below

##### Template Blocks
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

[Full Examples](#full-examples)

<span style = "color:orange">* optional</span>

---

#### 1) AWSTemplateFormatVersion<a name="aws-template-format-version"></a>

Identifies the structure and supported capabilities. [2010-09-09](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/format-version-structure.html) is currently the only version available

```json
{
  "AWSTemplateFormatVersion" : "2010-09-09"
}
```  
```yml
AWSTemplateFormatVersion: "2010-09-09"
```  

<br>

#### 2) Description<a name="description"></a>

Is used to help viewers identify the purpose of the template

```json
{
  "Description" : "A description to help identify the purpose of the template"
}
```  
```yml
Description: "A description to help identify the purpose of the template"
```

<br>

#### 3) Macros<a name="macros"></a> <span style = "color:orange">* </span>

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

<br>

#### 4) Parameters<a name="parameters"></a>

Are a way of creating dynamic inputs for your stacks. These are placeholder definitions for what the user/system can provide to cloudformation at runtime operationa

```json
{
  "Parameters" : {
    "param1": {
      "Type": "String",
      "AllowedValues": ["true", "false"],
      "Default": "true"
    },
    "param2": {
      "Type": "String"
    }
  }
}
```  
```yml
Parameters:
  param1:
    Type: String
    AllowedValues:
      - "true"
      - "false"
    Default: "true"
  param2:
    Type: String
```

<a name="parameters-referencing"></a>
##### 4a) Referencing

```json
{
  "Ref" : "param1"
}
```
```yml
!Ref 'param1'
```

<br>

#### 5) Metadata<a name="metadata"></a> <span style = "color:orange">* </span>

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
        "Parameters": ["param1", "param2"]
      }],
      "ParameterLabels": [{
        "param1": {
          "default": "Here is a custom description for param1"
        },
        "param2": {
          "default": "Here is a custom description for param2"
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

<br>

#### 6) Mappings<a name="mappings"></a> <span style = "color:orange">* </span>

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
##### 6a) Referencing

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

<br>

#### 7) Conditions<a name="conditions"></a> <span style = "color:orange">* </span>

A way of creating logic around property values, and/or cloudformation resource configuration. Mainly used for checking null values and helping your template work with them.

More information and examples at the [aws docs](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html)

(The below chains two intrinsic functions together to define a condition to check if the value entered in `param2` is not empty)

```json
{
  "Parameters": {
    "param1": {
      "Type": "String",
      "AllowedValues": ["true", "false"],
      "Default": "true"
    },
    "param2": {
      "Type": "String"
    }
  },
  "Conditions" : {
    "conditionParam2NotEmpty" : {
      "Fn::Not": {
        "Fn::Equals" : [
          {
            "Ref" : "param2"
          },
          ""
        ]
      }
    }
  }
}
```  

```yml
Parameters:
  param1:
    Type: String
    AllowedValues:
      - "true"
      - "false"
    Default: "true"
  param2:
    Type: String
Conditions:
  conditionParam2NotEmpty: !Not
    Fn::Equals:
      - !Ref 'param2'
      - ''
```

<a name="conditions-property-level"></a>
##### 7a) Using conditions at property level

If the condition (`conditionParam1NotEmpty`) is "true", assign the bucketName property to the value of the user input, else return null (auto assigns)

```json
{
  "Parameters": {
    "param1": {
      "Type": "String",
      "AllowedValues": ["true", "false"],
      "Default": "true"
    },
    "param2": {
      "Type": "String"
    }
  },
  "Conditions" : {
    "conditionParam2NotEmpty" : {
      "Fn::Not": {
        "Fn::Equals" : [
          {
            "Ref" : "param2"
          },
          ""
        ]
      }
    }
  },
  "Resources": {
    "S3Bucket": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "BucketName": {
          "Fn::If" : [
            "conditionParam2NotEmpty",
            {
              "Ref": "param2"
            },
            {
              "Ref": "AWS::NoValue"
            }
          ]
        }
      }
    }
  }
}
```
```yml
Parameters:
  param1:
    Type: String
    AllowedValues:
      - 'true'
      - 'false'
    Default: 'true'
  param2:
    Type: String
Conditions:
  conditionParam2NotEmpty: !Not
    Fn::Equals:
      - !Ref 'param2'
      - ''
Resources:
  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !If
        - conditionParam2NotEmpty
        - !Ref 'param2'
        - !Ref 'AWS::NoValue'
```
<a name="conditions-resource-level"></a>
##### 7b) Conditions at resource level

If the condition (`conditionCreateBucket`) is "true", then create the S3::Bucket, else, do not create

```json
{
  "Parameters": {
    "param1": {
      "Type": "String",
      "AllowedValues": ["true", "false"],
      "Default": "true"
    },
    "param2": {
      "Type": "String"
    }
  },
  "Conditions" : {
    "conditionCreateBucket" : {
      "Fn::Equals" : [
        {
          "Ref" : "param1"
        },
        "true"
      ]
    }
  },
  "Resources" : {
    "resource1": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "AccessControl": "Private"
      },
      "Condition": "conditionCreateBucket"
    }
  }
}
```
```yml
Parameters:
  param1:
    Type: String
    AllowedValues:
      - 'true'
      - 'false'
    Default: 'true'
  param2:
    Type: String
Conditions:
  conditionCreateBucket: !Equals
    - !Ref 'param1'
    - 'true'
Resources:
  resource1:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: Private
    Condition: conditionCreateBucket
```

<br>

#### 8) Resources<a name="resources"></a>

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
##### 8a) Referencing `default` return property

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
##### 8b) Referencing `different` property

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

<br>

#### 9) Outputs <a name="outputs"></a> <span style = "color:orange">* </span>
 
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
##### 9a) Exports

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

<br>

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
    "S3Bucket": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "BucketName": {
          "Fn::If" : [
            "conditionParam1NotEmpty",
            {
              "Ref": "param1"
            },
            {
              "Ref": "AWS::NoValue"
            }
          ]
        }
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
