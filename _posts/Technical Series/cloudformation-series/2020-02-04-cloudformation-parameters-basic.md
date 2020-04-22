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
docs:
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html\">AWS docs on cloudformation parameters</a>"
skill: novice
---

When using parameters with your template, you're effectively creating placeholders for a user / service to provide the details when an operation is performed (`createStack` / `updateStack`)

1. [Parameter Properties](#properties)
2. [Parameter Types (basic)](#types)
3. [Parameter Types (special types)]({{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-parameters-extended)
4. [Parameter Types (dynamic reference)]({{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-parameters-dynamic)

---

<a name = "properties"></a>
#### Parameter Properties

<div class="card official-docs">
  <div class="card-body">
    <a href = "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html#parameters-section-structure-properties">AWS docs on paramater properties</a>
  </div>
</div>

AllowedPattern
A regular expression that represents the patterns to allow for String types.

Required: No

AllowedValues
An array containing the list of values allowed for the parameter.

Required: No

ConstraintDescription
A string that explains a constraint when the constraint is violated. For example, without a constraint description, a parameter that has an allowed pattern of [A-Za-z0-9]+ displays the following error message when the user specifies an invalid value:

Malformed input-Parameter MyParameter must match pattern [A-Za-z0-9]+

By adding a constraint description, such as must only contain letters (uppercase and lowercase) and numbers, you can display the following customized error message:

Malformed input-Parameter MyParameter must only contain uppercase and lowercase letters and numbers

Required: No

Default
A value of the appropriate type for the template to use if no value is specified when a stack is created. If you define constraints for the parameter, you must specify a value that adheres to those constraints.

Required: No

Description
A string of up to 4000 characters that describes the parameter.

Required: No

MaxLength
An integer value that determines the largest number of characters you want to allow for String types.

Required: No

MaxValue
A numeric value that determines the largest numeric value you want to allow for Number types.

Required: No

MinLength
An integer value that determines the smallest number of characters you want to allow for String types.

Required: No

MinValue
A numeric value that determines the smallest numeric value you want to allow for Number types.

Required: No

NoEcho
Whether to mask the parameter value to prevent it from being displayed in the console, command line tools, or API. If you set the NoEcho attribute to true, CloudFormation returns the parameter value masked as asterisks (*****) for any calls that describe the stack or stack events.

Important
Rather than embedding sensitive information directly in your AWS CloudFormation templates, we recommend you use dynamic parameters in the stack template to reference sensitive information that is stored and managed outside of CloudFormation, such as in the AWS Systems Manager Parameter Store or AWS Secrets Manager.

For more information, see the Do Not Embed Credentials in Your Templates best practice.

Required: No

Type
The data type for the parameter (DataType).

Required: Yes


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
