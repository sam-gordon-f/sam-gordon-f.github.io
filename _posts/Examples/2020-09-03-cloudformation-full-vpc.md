---
layout: post
title: Full VPC
date: 2020-09-03 08:44:38
category: [examples]
author: samGordon
short-description: create / reference an identity provider in cloudformation
tags: [cloudformation, lambda, macro]
skill: expert
---

The below example creates a fully working VPC that changes its topology based on parameters

1. [Cloudformation template](#template)

---

<a name = "template"></a>
##### 1) Cloudformation template

The following builds a vpc with subnets structured like the following

| VPC Size  | AZ Count | Subnet Host Split | Hosts that can be used / Total Hosts ( host losses)  |
| --------- | -------- |:----------------------------------------                               | -----:|
| /24 | 1AZ | 64<br> 64<br> 64<br> 64                                                           | 256 / 256 (0 loss) |
|     | 2AZ | 32 32<br> 32 32<br> 32 32<br> 32 32                                               | 256 / 256 (0 loss) |
|     | 3AZ | 16 16 16<br> 16 16 16<br> 16 16 16<br> 16 16 16                                   | 192 / 256 (64 loss) |
| /23 | 1AZ | 128<br> 128<br> 128<br> 128                                                       | 512 / 512  (0 loss) |
|     | 2AZ | 64 64<br> 64 64<br> 64 64<br> 64 64                                               | 512 / 512 (0 loss) |
|     | 3AZ | 32 32 32<br> 32 32 32<br> (skip /26) 32 32 32<br> 32 32 32 (skip /26)             | 384 / 512 (128 loss) |
| /22 | 1AZ | 256<br> 256<br> 256<br> 256                                                       | 1024 / 1024 (0 loss) |
|     | 2AZ | 128 128<br> 128 128<br> 128 128<br> 128 128                                       | 1024 / 1024 (0 loss) |
|     | 3AZ | 64 64 64<br> (skip /26) 64 64 64<br> (skip /26) 64 64 64<br> (skip /26) 64 64 64  | 768 / 1024 (256 loss) |


```json
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Parameters": {
    "VPCAZCount": {
      "Type": "Number",
      "AllowedValues": [1, 2, 3]
    },
    "VPCCidr": {
      "Type": "String",
      "AllowedPattern": "^([0-9]{1,3}\\.){3}[0-9]{1,3}(\/)(24|23|22)$"
    }
  },
  "Mappings": {
    "subnetCIDRs": {
      "24": {
        "1": [],
        "2": [],
        "3": []
      },
      "23": {
        "1": [],
        "2": [],
        "3": []
      },
      "22": {
        "1": [],
        "2": [],
        "3": []
      }
    }
  },
  "Resources": {
    "EC2VPC": {
      "Type": "AWS::EC2::VPC",
      "Properties": {
        "CidrBlock" : {
          "Ref": "VPCCidr"
        },
        "EnableDnsHostnames" : true,
        "EnableDnsSupport" : true,  
      }
    }
  }
}
```
