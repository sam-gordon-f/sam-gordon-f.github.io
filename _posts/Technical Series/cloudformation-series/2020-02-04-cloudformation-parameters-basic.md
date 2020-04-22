---
layout: post
title: "Parameters (basics)"
date: 2020-02-03 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Cloudformation template/stack Parameters
tags: [cloudformation, parameters, yml, json]
prevPost:
  text: "Template anatomy"
  link: "/technical-series/cloudformation-series/cloudformation-template-anatomy"
nextPost:
  text: "Parameters (extended)"
  link: "/technical-series/cloudformation-series/cloudformation-parameters-extended"
skill: novice
---

When using parameters with your template, you're effectively creating placeholders for a user / service to provide the details when an operation is performed (`createStack` / `updateStack`)

1. [Parameter Properties](#properties)
2. [Parameter Types (basic)](#types)
3. [Parameter Types (special types)]({{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-parameters-extended)
4. [Dynamic reference (lookup values rather than supplying them)]({{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-parameters-dynamic)

---

<a name = "properties"></a>
#### Parameter Properties

<div class="card official-docs">
  <div class="card-body">
    <a href = "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html#parameters-section-structure-properties">AWS docs on paramater properties</a>
  </div>
</div>

The below is a progress way that you can use properties to build up your experience / validation when using properties

##### Type (only required property)

The value must be a string (can be used for pretty much any basic input value. See [Parameter Types (basic)](#types) for what basic types are supported)

```json
{
  "Parameters": {
    "param1": {
      "Type":"String"
    }
  }
}
```

##### AllowedPattern (non-required)

<div class="card tips">
  <div class="card-body">
    Please keep in mind that these use a java interpreter, so you must use java syntax
  </div>
</div>

The below tests for the string "test123"
```json
{
  "Parameters": {
    "param1": {
      "Type":"String",
      "AllowedPattern": "^[a-z]+[0-9]{3}$"
    }
  }
}
```

##### MaxLength

The max number of characters a user can specify

```json
{
  "Parameters": {
    "param1": {
      "Type":"String",
      "AllowedPattern": "^[a-z]+[0-9]{3}$",
      "MaxLength": 7
    }
  }
}
```

##### MinLength

The min number of characters a user can specify

```json
{
  "Parameters": {
    "param1": {
      "Type":"String",
      "AllowedPattern": "^[a-z]+[0-9]{3}$",
      "MinLength": 7
    }
  }
}
```

##### AllowedValues (non-required)

The below allows only the numbders [1,2,3,4,5] as inputs

```json
{
  "Parameters": {
    "param1": {
      "Type":"Number",
      "AllowedValues": [1,2,3,4,5]
    }
  }
}
```

##### ConstraintDescription (non-required)

Used for custom error messages when an input violation occurs

```json
{
  "Parameters": {
    "param1": {
      "Type":"Number",
      "AllowedValues": [1,2,3,4,5],
      "ConstraintDescription": "Only the numbers 1 - 5 are allowed"
    }
  }
}
```

##### Default (non-required)

If nothing supplied, use this value

```json
{
  "Parameters": {
    "param1": {
      "Type":"Number",
      "AllowedValues": [1,2,3,4,5],
      "ConstraintDescription": "Only the numbers 1 - 5 are allowed",
      "Default": 1
    }
  }
}
```

##### Description (non-required)

A label to help the user understand what the input represents

```json
{
  "Parameters": {
    "param1": {
      "Type":"Number",
      "AllowedValues": [1,2,3,4,5],
      "ConstraintDescription": "Only the numbers 1 - 5 are allowed",
      "Default": 1,
      "Description": "How many instances do you require"
    }
  }
}
```

##### MaxValue

What is the `highest` number a user can specify

```json
{
  "Parameters": {
    "param1": {
      "Type":"Number",
      "AllowedValues": [1,2,3,4,5],
      "ConstraintDescription": "Only the numbers 1 - 5 are allowed",
      "Default": 1,
      "Description": "How many instances do you require",
      "MaxValue": 5
    }
  }
}
```

##### MinValue

What is the `lowest` number a user can specify

```json
{
  "Parameters": {
    "param1": {
      "Type":"Number",
      "AllowedValues": [1,2,3,4,5],
      "ConstraintDescription": "Only the numbers 1 - 5 are allowed",
      "Default": 1,
      "Description": "How many instances do you require",
      "MaxValue": 5,
      "MinValue": 1
    }
  }
}
```

##### NoEcho

A way to hide (mask ***** ) a value that has been provided. This prevents cloudformation from returning the value to the user via console/api/cli. Great for sensative information ! (not that its recommended you ever pass secrets via params in this fashion)

```json
{
  "Parameters": {
    "param1": {
      "Type":"String",
      "Description": "Database admin password",
      "NoEcho": "true"
    }
  }
}
```

---

<a name = "types"></a>
#### Parameter Types

AWS CloudFormation supports the following parameter types:

String
A literal string.

For example, users could specify "MyUserName".

Number
An integer or float. AWS CloudFormation validates the parameter value as a number; however, when you use the parameter elsewhere in your template (for example, by using the Ref intrinsic function), the parameter value becomes a string.

For example, users could specify "8888".

List<Number>
An array of integers or floats that are separated by commas. AWS CloudFormation validates the parameter value as numbers; however, when you use the parameter elsewhere in your template (for example, by using the Ref intrinsic function), the parameter value becomes a list of strings.

For example, users could specify "80,20", and a Ref would result in ["80","20"].

CommaDelimitedList
An array of literal strings that are separated by commas. The total number of strings should be one more than the total number of commas. Also, each member string is space trimmed.

For example, users could specify "test,dev,prod", and a Ref would result in ["test","dev","prod"].

AWS-Specific Parameter Types
AWS values such as Amazon EC2 key pair names and VPC IDs. For more information, see AWS-Specific Parameter Types.

SSM Parameter Types
Parameters that correspond to existing parameters in Systems Manager Parameter Store. You specify a Systems Manager parameter key as the value of the SSM parameter, and AWS CloudFormation fetches the latest value from Parameter Store to use for the stack. For more information, see SSM Parameter Types.
