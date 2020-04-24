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

Below I've listed the properties in a progressive way that shows how you can combine them to control your inputs

<a name = "properties-type"></a>
##### Type ( required )

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

<div class="card tip">
  <div class="card-body">
    Please keep in mind that these use a java interpreter, so you must use <a href = "https://www.freeformatter.com/java-regex-tester.html">java syntax</a>
  </div>
</div>
<div class="card tip">
  <div class="card-body">
    Make sure to escape `\` (backslash characters) too
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

##### MinLength

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

##### Default (non-required)

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

##### Description (non-required)

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

##### MaxValue

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

##### MinValue

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

Below are the basic paramaters types ( See [Type](#properties-type) )

<div class="card tip">
  <div class="card-body">
    Please note that Intrinsic functions convert params to strings when used
  </div>
</div>

##### String

```
# input value
> test123

# when referenced
"test123"
```

##### Number

```
# input value
> 123

# when referenced
"123"
```

##### List<Number>
```
# input value
> 1,2,3

# when referenced
["1", "2", "3"]
```

##### CommaDelimitedList
```
# input value
> "test123", "test321"

# when referenced
["test123", "test321"]
```
