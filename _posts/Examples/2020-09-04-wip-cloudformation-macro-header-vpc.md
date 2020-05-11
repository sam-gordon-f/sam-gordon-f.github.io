---
layout: post
title: Cloudformation Macro mapped VPC
date: 2020-09-03 08:44:38
category: [examples]
author: samGordon
short-description: create a full working VPC with cloudformation "and macros"
tags: [cloudformation, lambda, macro]
skill: expert
---

The below example creates a fully working VPC that changes its topology based on parameters

1. [Subnet Split](#subnet-information)
1. [Lambda Function](#lambda-function)
2. [Cloudformation template](#template)

---

<a name = "subnet-information"></a>
##### 1) Subnet Information

Because we're not restricted by even splits, you're free to return whatever structure you need

<a name = "lambda-function"></a>
##### 2) Lambda Function

```javascript
exports.handler = (event, context, callback) => {
  
  var fragment = {

  }

  callback(null, {
      requestId: event.requestId,
      status: "success",
      fragment: fragment
  });
};
```

<br>

<a name = "template"></a>
##### 2) Cloudformation template

By changing the AZ's and Cidr specified, the network automatically resizes, and allocates (based on the mapping) to the subnets

```json
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Transform": "macroVpcLayout",
  "Parameters": {
    "VPCAZCount": {
      "Type": "Number",
      "AllowedValues": [1, 2, 3]
    }
  },
  "Resources": {
    "EC2VPC": {
      "Type": "AWS::EC2::VPC",
      "Properties": {
        "CidrBlock" : {
          "Fn::FindInMap": ["networkMapping", "vpc", "cidr"]
        },
        "EnableDnsHostnames" : true,
        "EnableDnsSupport" : true  
      }
    }
  }
}
```
