---
layout: post
title: "Intrinsic Functions"
date: 2020-02-03 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Cloudformation provided functions
tags: [cloudformation, functions, yml, json, intrinsic]
prevPost:
  text: "Parameters"
  link: "/tecnical-series/cloudformation-series/cloudformation-parameters"
nextPost:
  text: "Custom Resources"
  link: "/technical-series/cloudformation-series/cloudformation-custom-resources"
docs:
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html\">AWS docs on cloudformation intrinsic functions</a>"
tip:
  - "If using YML - avoid the shorthand notation, as it doesnt convert well with tools like cfn-flip"
---

1. [Base64](#base64)
  a. [Usage](#base64-usage)
2. [Cidr](#cidr)
  a. [Usage](#cidr-usage)
3. [FindInMap](#findinmap)
  a. [Usage](#findinmap-usage)

These are the following functions cloudformation makes available, and a definition / example of what they perform and how

#### Fn::Base64 <a name="base64"></a>

Used for encoding strings into Base64 encoding. This is generally seen when bootstrapping ec2 instances in the `UserData` property

```json
{
  "Fn::Base64" : "valueToEncode"
}
```
```yml
Fn::Base64: "valueToEncode"
```

##### Usage <a name="base64-usage"></a>

The below installs the cfn-init package to allow bootstrap from some metadata in the same template.
It does this by joining a list of commands into a string (no separators), then base64 encoding the string as the template requires.

```json
{
  "Resources": {
    "MyInstance" : {
      "Type" : "AWS::EC2::Instance",
      "Properties" : {
        "UserData" : {
          "Fn::Base64" : {
            "Fn::Join" : ["", [
              "#!/bin/bash -xe\n",
              "yum install -y aws-cfn-bootstrap\n",
              "/opt/aws/bin/cfn-init -v ",
              "         --stack ", { "Ref" : "AWS::StackName" },
              "         --resource <<resourceWhereMetaResides>> ",
              "         --configsets Install ",
              "         --region ", { "Ref" : "AWS::Region" }, "\n"  
            ]]
          }
        }
      }
    }
  }
}
```
```yml
Resources:
  MyInstance:
    Type: "AWS::EC2::Instance"
    Properties:
      UserData:
        Fn::Base64:
          Fn::Join : ["", [
            "#!/bin/bash -xe\n",
            "yum install -y aws-cfn-bootstrap\n",
            "/opt/aws/bin/cfn-init -v ",
            "         --stack ", { "Ref" : "AWS::StackName" },
            "         --resource <<resourceWhereMetaResides>> ",
            "         --configsets Install ",
            "         --region ", { "Ref" : "AWS::Region" }, "\n"  
          ]]
```

#### Fn::Cidr <a name="cidr"></a>

Used for auto generating CIDR blocks. This is generally seen when splitting a VPC CIDR into Subnet CIDR's.

The below splits a `/24` block ( 8 subnet bits / 256 hosts ) into `6` individual `/27` ( 5 subnet bits / 32 hosts ) blocks. This gives the below table.

```
1. 192.168.0.0/27 (32 hosts)
2. 192.168.0.32/27 (32 hosts)
3. 192.168.0.64/27 (32 hosts)
4. 192.168.0.96/27 (32 hosts)
5. 192.168.0.128/27 (32 hosts)
6. 192.168.0.160/27 (32 hosts)
```
```json
{
  "Fn::Cidr" : [ "192.168.0.0/24", "6", "5"]
}
```
```yml
Fn::Cidr: [ "192.168.0.0/24", "6", "5" ]
```

##### Usage <a name="cidr-usage"></a>

The example below is similar to the above, except it
1. Creates a VPC
  a. with a Cidr block of `192.168.0.0/24`
2. Creates a Subnet
  a. where the Cidr block is the 0th index of a dynamic map of 6 x /27 Cidrs

```json
{
  "Resources" : {
    "EC2Vpc" : {
      "Type" : "AWS::EC2::VPC",
      "Properties" : {
        "CidrBlock" : "192.168.0.0/24"
      }
    },
    "EC2Subnet" : {
      "Type" : "AWS::EC2::Subnet",
      "Properties" : {
        "CidrBlock" : {
          "Fn::Select" : [
            0, {
              "Fn::Cidr" : [
                {
                  "Fn::GetAtt" : [
                    "EC2Vpc", "CidrBlock"
                  ]
                },
                6,
                5
              ]
            }
          ]
        },
        "VpcId" : {
          "Ref" : "EC2Vpc"
        }
      }
    }
  }
}
```
```yml
Resources:
  EC2Vpc:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 192.168.0.0/24
  EC2Subnet:
    Type: AWS::EC2::Subnet
    Properties:
      CidrBlock: !Select
        - 0
        - !Cidr
          - !GetAtt 'EC2Vpc.CidrBlock'
          - 6
          - 5
      VpcId: !Ref 'EC2Vpc'
```

##### Fn::FindInMap <a name="findinmap"></a>
##### Fn::GetAtt
##### Fn::GetAZs
##### Fn::ImportValue
##### Fn::Join
##### Fn::Select
##### Fn::Split
##### Fn::Sub
##### Fn::Transform
##### Ref
