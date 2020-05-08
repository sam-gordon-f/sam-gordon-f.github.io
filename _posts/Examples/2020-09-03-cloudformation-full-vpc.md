---
layout: post
title: Cloudformation Dynamic VPC
date: 2020-09-03 08:44:38
category: [examples]
author: samGordon
short-description: create a full working dynamically built VPC
tags: [cloudformation, lambda, macro]
skill: expert
---

The below example creates a fully working VPC that changes its topology based on parameters

1. [Subnet Split](#subnet-split)
2. [Cloudformation template](#template)

---

<a name = "subnet-split"></a>
##### 1) Subnet Split

The following builds a vpc with subnets structured like the following

<table style = "width:100%;" class="sortable-theme-dark" data-sortable>
  <tr>
    <th>
      VPC Size
    </th>
    <th>
      AZ Count
    </th>
    <th>
      Subnet Host Split
    </th>
    <th>
      Hosts that can be used / Total Hosts ( host losses)
    </th>
  </tr>
  <tr>
    <td valign = "top">
      x.x.x.x \ 24
    </td>
    <td valign = "top">
      1AZ
    </td>
    <td>
      64<br> 64<br> 64<br> 64
    </td>
    <td valign = "top">
      256 / 256 (0 loss)
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td valign = "top">
      2AZ
    </td>
    <td>
      32 32<br> 32 32<br> 32 32<br> 32 32
    </td>
    <td valign = "top">
      256 / 256 (0 loss)
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td valign = "top">
      3AZ
    </td>
    <td>
      16 16 16<br> 16 16 16<br> 16 16 16<br> 16 16 16
    </td>
    <td valign = "top">
      192 / 256 (64 loss)
    </td>
  </tr>
  <tr>
    <td valign = "top">
      x.x.x.x \ 23
    </td>
    <td valign = "top">
      1AZ
    </td>
    <td>
      128<br> 128<br> 128<br> 128
    </td>
    <td valign = "top">
      512 / 512 (0 loss)
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td valign = "top">
      2AZ
    </td>
    <td>
      64 64<br> 64 64<br> 64 64<br> 64 64
    </td>
    <td valign = "top">
      512 / 512 (0 loss)
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td valign = "top">
      3AZ
    </td>
    <td>
      32 32 32 <br> 32 32 32(skip /26)<br> 32 32 32<br> 32 32 32(skip /26)
    </td>
    <td valign = "top">
      384 / 512 (128 loss)
    </td>
  </tr>
  <tr>
    <td valign = "top">
      x.x.x.x \ 22
    </td>
    <td valign = "top">
      1AZ
    </td>
    <td>
      256<br> 256<br> 256<br> 256
    </td>
    <td valign = "top">
      1024 / 1024 (0 loss)
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td valign = "top">
      2AZ
    </td>
    <td>
      128 128<br> 128 128<br> 128 128<br> 128 128
    </td>
    <td valign = "top">
      1024 / 1024 (0 loss)
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td valign = "top">
      3AZ
    </td>
    <td>
      64 64 64 <br> 64 64 64(skip /26)<br> 64 64 64<br> 64 64 64(skip /26)
    </td>
    <td valign = "top">
      768 / 1024 (256 loss)
    </td>
  </tr>
</table>

<a name = "template"></a>
##### 2) Cloudformation template

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
    },
    "EC2SubnetWeb0": {
      "Type": "AWS::EC2::Subnet",
      "Properties": {
        "AvailabilityZone" : {
          "Fn::Select": [0, {
            "Fn::GetAZs": {
              "Ref": "AWS::Region"
            }
          }]
        },
        "CidrBlock" : {
          "Fn::Cidr": [
            {
              "Ref": "VPCCidr"
            },
            "<<total number of subnets needed>>",
            "<<subnet bits required for each>>"
          ]
        },
        "MapPublicIpOnLaunch" : true,
        "VpcId" : {
          "Ref": "EC2VPC"
        }
      }
    },
    "EC2SubnetWeb1": {
      "Type": "AWS::EC2::Subnet",
      "Properties": {
        "AvailabilityZone" : {
          "Fn::Select": [1, {
            "Fn::GetAZs": {
              "Ref": "AWS::Region"
            }
          }]
        },
        "CidrBlock" : {
          "Fn::Cidr": [
            {
              "Ref": "VPCCidr"
            },
            "<<total number of subnets needed>>",
            "<<subnet bits required for each>>"
          ]
        },
        "MapPublicIpOnLaunch" : true,
        "VpcId" : {
          "Ref": "EC2VPC"
        }
      }
    },
    "EC2SubnetWeb2": {
      "Type": "AWS::EC2::Subnet",
      "Properties": {
        "AvailabilityZone" : {
          "Fn::Select": [2, {
            "Fn::GetAZs": {
              "Ref": "AWS::Region"
            }
          }]
        },
        "CidrBlock" : {
          "Fn::Cidr": [
            {
              "Ref": "VPCCidr"
            },
            "<<total number of subnets needed>>",
            "<<subnet bits required for each>>"
          ]
        },
        "MapPublicIpOnLaunch" : true,
        "VpcId" : {
          "Ref": "EC2VPC"
        }
      }
    }
  }
}
```
