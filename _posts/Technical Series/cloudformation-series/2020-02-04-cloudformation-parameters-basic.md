---
layout: post
title: "Parameters - basics"
date: 2020-02-04 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Cloudformation template/stack Parameters
tags: [cloudformation, parameters, yml, json]
skill: novice
---

Parameters are effectively placeholders for a user or service to provide details when a create/update operation is performed.
They can be customised in a number of ways to help guide and control which values can be used

##### Parameter Basic Data Types
1. [String](#type-string)
2. [Number](#type-number)
3. [List](#type-list)
4. [CommaDelimitedList](#type-comma-delimited-list)

##### Parameter Properties
1. [Type](#properties-type)
2. [AllowedPattern](#properties-allowed-pattern)
3. [MaxLength](#properties-max-length)
4. [MinLength](#properties-min-length)
5. [AllowedValues](#properties-allowed-values)
6. [ConstraintDescription](#properties-constraint-description)
7. [Default](#properties-default)
8. [Description](#properties-description)
9. [MaxValue](#properties-max-value)
10. [MinValue](#properties-min-value)
11. [NoEcho](#properties-no-echo)

---

<a name = "types"></a>
#### Parameter Basic Data Types

Below are the different basic parameters data types ( See [Type](#properties-type) ).

<div class="card tip">
  <div class="card-body">
    Please note that Intrinsic functions convert params to strings when used
  </div>
</div>

<a name = "type-string"></a>
##### 1) String

```
# input value
> test123

# when referenced
"test123"
```

<a name = "type-number"></a>
##### 2) Number

```
# input value
> 123

# when referenced
"123"
```

<a name = "type-list"></a>
##### 3) List<Number>
```
# input value
> 1,2,3

# when referenced
["1", "2", "3"]
```

<a name = "type-comma-delimited-list"></a>
##### 4) CommaDelimitedList
```
# input value
> "test123", "test321"

# when referenced
["test123", "test321"]
```

---

<a name = "properties"></a>
#### Parameter Properties

Below are the properties that you can use to customise, guide and control what the user / system inputs.
The below is listed in a progressive fashion that shows how you can combine them

<div class="card official-docs">
  <div class="card-body">
    <a href = "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html#parameters-section-structure-properties">AWS docs on paramater properties</a>
  </div>
</div>

<a name = "properties-type"></a>
##### 1) Type ( required )

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

<a name = "properties-allowed-pattern"></a>
##### 2) AllowedPattern

<div class="card tip">
  <div class="card-body">
    Please keep in mind that these use a java interpreter, so you must use <a href = "https://www.freeformatter.com/java-regex-tester.html">java syntax</a>
  </div>
</div>
<div class="card tip">
  <div class="card-body">
    Make sure to escape `\\` (backslash characters)
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

<a name = "properties-max-length"></a>
##### 3) MaxLength

The max number of characters a user can specify. The below checks for a max of 7 characters

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

<a name = "properties-min-length"></a>
##### 4) MinLength

The min number of characters a user can specify. The below checks for a min of 7 characters

```json
{
  "Parameters": {
    "param1": {
      "Type":"String",
      "AllowedPattern": "^[a-z]+[0-9]{3}$",
      "MaxLength": 7,
      "MinLength": 7
    }
  }
}
```

<a name = "properties-allowed-values"></a>
##### 5) AllowedValues

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

<a name = "properties-constraint-description"></a>
##### 6) ConstraintDescription

Used for custom error messages when an input violation occurs. The below presents a custom message that shows the user how to correctly enter a value

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

<a name = "properties-default"></a>
##### 7) Default

If nothing supplied, use this value. The below gives a default of `1`

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

<a name = "properties-description"></a>
##### 8) Description

A label to help the user understand what the input represents.

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

<a name = "properties-max-value"></a>
##### 9) MaxValue

What is the `highest` number a user can specify. The below checks for inputs greater than 5

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

<a name = "properties-min-value"></a>
##### 10) MinValue

What is the `lowest` number a user can specify. The below checks for inputs lower than 1

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

<a name = "properties-no-echo"></a>
##### 11) NoEcho

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
