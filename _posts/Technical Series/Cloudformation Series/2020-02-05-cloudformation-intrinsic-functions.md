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
  link: "/technical-series/cloudformation-series/cloudformation-parameters"
nextPost:
  text: "Custom Resources"
  link: "/technical-series/cloudformation-series/cloudformation-custom-resources"
docs:
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html\">AWS docs on cloudformation intrinsic functions</a>"
tip:
  - "If using YML - avoid the shorthand notation, as it doesnt convert well with tools like cfn-flip"
---

These are the following functions cloudformation makes available, and a definition / example of what they perform and how

1. [Base64](#base64)
  a. [Usage](#base64-usage)
2. [Cidr](#cidr)
  a. [Usage](#cidr-usage)
3. [FindInMap](#findinmap)
  a. [Usage](#findinmap-usage)
4. [GetAtt](#getatt)
  a. [Usage](#getatt-usage)
5. [GetAZs](#getazs)
  a. [Usage](#getazs-usage)
6. [ImportValue](#importvalue)
  a. [Usage](#importvalue-usage)
7. [Join](#join)
  a. [Usage](#join-usage)
8. [Select](#select)
  a. [Usage](#select-usage)
9. [Split](#split)
  a. [Usage](#split-usage)
10. [Sub](#sub)
  a. [Usage](#sub-usage)
11. [Transform](#transform)
  a. [Usage](#transform-usage)
12. [Ref](#ref)
  a. [Usage](#ref-usage)

---

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

---

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

---

#### Fn::FindInMap <a name="findinmap"></a>

Used for referencing values from mapping constructs. This is generally seen when looking up config in templates.

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
Fn::FindInMap" : [ "mapping1", "mappingPropCategory1", "mappingPropName"]
```

##### Usage <a name="findinmap-usage"></a>

The below has a mapping that contains a property value that an S3 Bucket needs to reference

```json
{
  "Mappings" : {
    "mapping1" : {
      "mappingPropCategory1" : {
        "mappingPropName" : "Private"
      }
    }
  },
  "Resources" : {
    "S3Bucket" : {
      "Type" : "AWS::S3::Bucket",
      "Properties" : {
        "AccessControl" : {
          "Fn::FindInMap": [
            "mapping1",
            "mappingPropCategory1",
            "mappingPropName"
          ]
        }
      }
    }
  }
}
```
```yml
Mappings:
  mapping1:
    mappingPropCategory1:
      mappingPropName: Private
Resources:
  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: !FindInMap
        - mapping1
        - mappingPropCategory1
        - mappingPropName
```

---

#### Fn::GetAtt <a name="getatt"></a>

Used for referencing attributes from other resources in the same template. This is generally seen when resources have a dependency on a value from another resource.

<div class="card tip">
  <div class="card-body">
    When using this function you have to keep in mind the properties that the resource exposes, as not `every` value is accessible. You'll need to continually reference [the docs](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html) as this can be close to impossible to remember
  </div>
</div>

```json
{
  "Fn::GetAtt" : [
    "resource1",
    "<<propName>>"
  ]
}
```
```yml
Fn::GetAtt : [ "resource1", "<<propName>>"]
```

##### Usage <a name="getatt-usage"></a>

The below has an SNS Topic (not named), and an output that looks up the AWS-allocated name to present to a viewer

```json
{
  "Resources" : {
    "SNSTopic": {
      "Type" : "AWS::SNS::Topic"
    }
  },
  "Outputs": {
    "OutputSNSTopic": {
      "Value": {
        "Fn::GetAtt": [
          "SNSTopic",
          "TopicName"
        ]
      },
      "Name": "SNSTopic"
    }
  }
}
```
```yml
Resources:
  SNSTopic:
    Type: AWS::SNS::Topic
Outputs:
  OutputSNSTopic:
    Value: !GetAtt 'SNSTopic.TopicName'
    Name: SNSTopic
```

---

#### Fn::GetAZs <a name="getazs"></a>

Used for return a list of Availabilty zones for a region. This is generally seen for multi region resources like load balancers, RDS, etc...

```json
{
  "Fn::GetAZs" : "<<region>>"
}
```
```yml
Fn::GetAZs : "<<region>>"
```

##### Usage <a name="getazs-usage"></a>

The below example uses this to determine an available AZ for a subnet

```json
{
  "Resources": {
    "EC2Subnet" : {
      "Type" : "AWS::EC2::Subnet",
      "Properties" : {
        "VpcId" : {
          "Ref" : "<<vpcId>>"   
        },
        "CidrBlock" : "10.0.0.0/24",
        "AvailabilityZone" : {
          "Fn::Select" : [
            "0",
            {
              "Fn::GetAZs" : {
                "Ref": "AWS::Region"
              }
            }
          ]
        }
      }
    }
  }
}
```
```yml
Resources:
  EC2Subnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref '<<vpcId>>'
      CidrBlock: 10.0.0.0/24
      AvailabilityZone: !Select
        - '0'
        - !GetAZs
          Ref: AWS::Region
```

---

#### Fn::ImportValue <a name="importvalue"></a>

Used to reference a value that has been `exported` from another stack. This is generally seen when resources are separated into different stacks, but still have dependencies on one another

```json
{
  "Fn::ImportValue" : "<<keyName>>"
}
```
```yml
Fn::ImportValue : "<<keyName>>"
```

##### Usage <a name="importvalue-usage"></a>

The below example has a stack which exports an s3 bucket domain name (key: `stack1-bucket1-domainName`), which is then referenced by a route 53 CName record

```json
{
  "Resources": {
    "Route53RecordSet": {
      "Type" : "AWS::Route53::RecordSet",
      "Properties" : {
        "HostedZoneId" : "<<hostedZoneId>>",
        "Name" : "testRecord",
        "ResourceRecords" : [
          {
            "Fn::ImportValue": "stack1-bucket1-domainName"
          }
        ],
        "TTL" : "300",
        "Type" : "CNAME"
      }
    }
  }
}
```
```yml
Resources:
  Route53RecordSet:
    Type: AWS::Route53::RecordSet
    Properties:
      HostedZoneId: <<hostedZoneId>>
      Name: testRecord
      ResourceRecords:
        - !ImportValue 'stack1-bucket1-domainName'
      TTL: '300'
      Type: CNAME
```

---

#### Fn::Join <a name="join"></a>

Used to join an array of strings with a specific delimeter. This is seen absolutely everywhere and is super hand to keep on hand

```json
{
  "Fn::Join" : [ ",", [ "<<string1>>", "etc..." ] ]
}
```
```yml
Fn::Join: [ ",", [ "<<string1>>", "etc..." ] ]
```

##### Usage <a name="join-usage"></a>

See [Base64 Usage](#base64-usage) for an example on joining strings for the userdata property

---

#### Fn::Select <a name="select"></a>
##### Usage <a name="select-usage"></a>

---

#### Fn::Split <a name="split"></a>
##### Usage <a name="split-usage"></a>

---

#### Fn::Sub <a name="sub"></a>
##### Usage <a name="sub-usage"></a>

---

#### Fn::Transform <a name="transform"></a>
##### Usage <a name="transform-usage"></a>

---

#### Ref <a name="ref"></a>
##### Usage <a name="ref-usage"></a>
