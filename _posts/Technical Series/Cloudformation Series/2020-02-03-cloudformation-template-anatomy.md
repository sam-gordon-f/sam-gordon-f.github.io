---
layout: post
title: "Template Anatomy"
date: 2020-02-02 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Cloudformation template dissection / anatomy
tags: [cloudformation, anatomy]
prevPost:
  text: "Concepts"
  link: "/technical-series/cloudformation-series/cloudformation-concepts"
nextPost:
  text: "Parameters"
  link: "/technical-series/cloudformation-series/cloudformation-parameters"
docs:
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html\">AWS docs on cloudformation template components</a>"
tips:
  - "<a href = \"https://github.com/awslabs/aws-cfn-template-flip\">cfn-flip</a> is super handy if examples arent in a format that you're used to working with. In the examples below, I've used both JSON and yml to save you the hassle"
---

1. [AWSTemplateFormatVersion](#aws-template-format-version)
2. [Description](#description)
3. [Macros](#macros)
4. [Parameters](#parameters)
5. [Metadata](#metadata)
6. [Mappings](#mappings)
7. [Conditions](#conditions)
8. [Resources](#resources)
9. [Outputs / Exports](#outputs-exports)
10. [Full Examples](#full-examples)

---

#### AWSTemplateFormatVersion<a name="aws-template-format-version"></a>

Identifies the structure and supported capabilities. [2010-09-09](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/format-version-structure.html) is currently the only version available

```
"AWSTemplateFormatVersion" : "2010-09-09"
```  
```yml
AWSTemplateFormatVersion: "2010-09-09"
```  

---

#### Description<a name="description"></a>

Is used to help viewers identify the purpose of the template

```
"Description" : "A description to help identify the purpose of the template"
```  
```yml
Description: "A description to help identify the purpose of the template"
```

---

#### Macros<a name="macros"></a>

Are a directive for cloudformation (at runtime) to take the entirety of whats supplied and run through one or more custom, or AWS managed transforms. These can be defined in the header (as shown) for full template transforms, or inline (more details later)
  <br>
In the below example, there are the following sample transforms defined.

> transform1 - which is a custom user defined transform (actions not listed)

> AWS::Serverless - which is an AWS defined transform for creating lambda functions (details [here](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-aws-serverless.html))

> AWS::Include - which is an AWS defined transform for pulling in cloudformation snippets from S3

```
"Transform" : [
  "transform1",
  "AWS::Serverless",
  "AWS::Include"
]
```  
```yml
Transform: ["transform", "AWS::Serverless", "AWS::Include"]
```

<div class="card tip">
  <div class="card-body">
    These are covered in a lot more detail in the following two posts
    <a href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-macros-transform">transform</a>
      <br>
    <a href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-macros-include">includes</a>
  </div>
</div>

---

#### Parameters<a name="parameters"></a>

Are a way of creating dynamic inputs for your stacks. These are placeholder definitions for what the user/system can provide to cloudformation at runtime operationa

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

> How to reference parameters

```
{ "Ref" : "param1" }
```

```yml
Ref: "param1"
```

---

#### Metadata<a name="metadata"></a>

Can be for storing custom information about your stack and/or some reserved directives. 3 sections described below

> AWS::CloudFormation::Designer. Used by the Cloudformation Designer to store meta about where resources reside on the map

> AWS::CloudFormation::Init. Used by cfn-init to bootstrap EC2 Instances

> AWS::CloudFormation::Interface. Used to help prettify cloudformation operation interfaces (create / update)

```
  "Metadata" : {
    "Instances" : {"Description" : "Information about the instances"},
    "Databases" : {"Description" : "Information about the databases"}",
    "AWS::CloudFormation::Designer",
    "AWS::CloudFormation::Init",
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

#### Mappings<a name="mappings"></a>

Ways of defining config for within templates. These can be dynamically referenced using intrinsic functions paired with 'Parameters'

```
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
```  

```yml
Mappings:
  mapping1:
    mappingPropCategory1:
      mappingPropName: mappingPropValue
    mappingPropCategory2:
      mappingPropName: mappingPropValue2
```

> How to reference map variables

```
{ "Fn::FindInMap" : [ "mapping1", "mappingPropCategory1", "mappingPropName"] }
```

```yml
Fn::FindInMap:
  - mapping1
  - mappingPropCategory1
  - mappingPropName
```

---

#### Conditions<a name="conditions"></a>

A way of creating logic around property values, and/or cloudformation resource configuration. Mainly used for checking null values and helping your template work with them

```
"Conditions" : {
  "condition1CheckParam1IsSetToSecond" : {
    "Fn::Equals" : [
      {"Ref" : "param1"},
      "second"
    ]
  }
}
```  

```yml
Conditions:
  condition1CheckParam1IsSetToSecond:
    Fn::Equals: [!Ref param1, second]
```

> How to use conditions

```
{ "Fn::FindInMap" : [ "mapping1", "mappingPropCategory1", "mappingPropName"] }
```

```yml
Fn::FindInMap:
  - mapping1
  - mappingPropCategory1
  - mappingPropName
```

---

#### Resources<a name="resources"></a>

The contents(resources) to be contained within your stack. Typically each resource is denoted by one logical ID (what the template specifies as the JSON/YML key).
See. [Cloudformation template/stack resources]({{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-resources)

```
  "Resources" : {
    "resource1": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "AccessControl": "Private"
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

> How to reference resource properies

```
{ "Ref" : "resource1" }
```
```yml
Ref: "param1"
```

```
{ "Fn::GetAtt" : ["resource1", "Arn"] }
```
```yml
Fn::GetAtt: ["param1", "Arn"]
```



---

#### Outputs / Exports<a name="outputs-exports"></a>

A list of values that you wish to make available for vierers. These can also be exposed as exports (`must be unique keys`, and use the directive in the example above)

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

> How to reference exports

```
{ "Fn::ImportValue" : "export1" }
```

```yml
Fn::ImportValue: "export1"
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
AWSTemplateFormatVersion: "2010-09-09"
Description: "A description to help identify the purpose of the template"
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
      -
        Label:
          default: "Custom Parameter Group1"
        Parameters:
          - param1
    ParameterLabels:
      param1:
        default: "Here is a custom description for param1"
Mappings:
  mapping1:
    mappingPropCategory1:
      mappingPropName: mappingPropValue
    mappingPropCategory2:
      mappingPropName: mappingPropValue2
Conditions:
  condition1CheckParam1IsSetToSecond:
    Fn::Equals: [!Ref param1, second]
Resources:
  resource1:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: "Private"
Outputs:
  output1:
    Description: "Here is the default value when referencing an S3 Bucket (logicalId)"
    Value: !Ref resource1
    Name: "resource1LogicalId"
    Export:
      Name: export1
```
