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
skill: novice
---

These are the following functions cloudformation makes available, and a definition / example of what they perform and how

1. [Base64](#base64)
  a. [Usage](#base64-usage)
2. [Cidr](#cidr)
  a. [Usage](#cidr-usage)
3. [FindInMap](#findinmap) <span style = "color:orange">* </span>
  a. [Usage](#findinmap-usage)
4. [GetAtt](#getatt) <span style = "color:orange">* </span>
  a. [Usage](#getatt-usage)
5. [GetAZs](#getazs)
  a. [Usage](#getazs-usage)
6. [ImportValue](#importvalue)
  a. [Usage](#importvalue-usage)
7. [Join](#join) <span style = "color:orange">* </span>
  a. [Usage](#join-usage)
8. [Select](#select) <span style = "color:orange">* </span>
  a. [Usage](#select-usage)
9. [Split](#split)
  a. [Usage](#split-usage)
10. [Sub](#sub) <span style = "color:orange">* </span>
  a. [Usage](#sub-usage)
11. [Transform](#transform)
  a. [Usage](#transform-usage)
12. [Ref](#ref) <span style = "color:orange">** </span>
  a. [Usage](#ref-usage)

<span style = "color:orange">* important functions to take note of as you'll use them almost religiously</span>

---

#### Fn::Base64 <a name="base64"></a>

Used for encoding strings into Base64 encoding. This is generally seen when bootstrapping ec2 instances in the `UserData` property

```json
{
  "Fn::Base64" : "<<valueToEncode>>"
}
```
```yml
!Base64 "<<valueToEncode>>"
```

##### Usage <a name="base64-usage"></a>

The below installs the cfn-init package to allow bootstrap from some metadata in the same template.
It does this by joining a list of commands into a string (no separators), then base64 encoding the string as the template requires.

```json
{
  "Resources": {
    "EC2Instance" : {
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
  EC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      UserData: !Base64
        Fn::Join:
          - ''
          - - "#!/bin/bash -xe\n"
            - "yum install -y aws-cfn-bootstrap\n"
            - '/opt/aws/bin/cfn-init -v '
            - '         --stack '
            - !Ref 'AWS::StackName'
            - '         --resource <<resourceWhereMetaResides>> '
            - '         --configsets Install '
            - '         --region '
            - !Ref 'AWS::Region'
            - "\n"
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
!Cidr [ "192.168.0.0/24", "6", "5" ]
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

<div class="card tip">
  <div class="card-body">
    When using this function, keep in mind you can use a parameter in place of `mappingPropCategory1` (from example below). This means that your first level key could describe something that a user inputs. You'll see more examples of this later on
  </div>
</div>

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
!FindInMap [ "mapping1", "mappingPropCategory1", "mappingPropName"]
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
    When using this function you have to keep in mind the properties that the resource exposes, as not `every` value is accessible. You'll need to continually reference <a href = "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html">the docs</a> as this can be close to impossible to remember all the supported outputs per resource
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
!GetAtt 'resource1.<<propName>>'
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
!GetAZs "<<region>>"
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
!ImportValue '<<keyName>>'
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
  "Fn::Join" : [
    ",",
    [ "<<string1>>", "etc..." ]
  ]
}
```
```yml
!Join
- ','
- - <<string1>>
  - etc...
```

##### Usage <a name="join-usage"></a>

See [Base64 Usage](#base64-usage) for an example on joining strings for the userdata property

---

#### Fn::Select <a name="select"></a>

Used to return a specific index from a list. This is seen quite a bit when there are AZ's involved

```json
{
  "Fn::Select" : [
    0,
    ["item1", "etc..."]
  ]
}
```
```yml
!Select
- 0
- - item1
  - etc...
```

##### Usage <a name="select-usage"></a>

See [GetAZs Usage](#getazs-usage), or [Split Usage](#split-usage) for examples on using this function

---

#### Fn::Split <a name="split"></a>

Used to split a list by a specified delimeter. This is seen quite a bit when there are URLs, or comma separated lists involved

```json
{
  "Fn::Split" : [
    ",",
    "test1, test2, etc..."
  ]
}
```
```yml
!Split
- ','
- test1, test2, etc...
```

##### Usage <a name="split-usage"></a>

In below example, a URL is passed as a parameter and we only want the FQDN, not the path part. We've done this by splitting the string into an array, and then `selecting` the 0th index

```json
{
  "Parameters": {
    "url": {
      "Type": "String",
      "Default": "www.testDomain.com/part1/part2"
    }
  },
  "Outputs": {
    "outputDomainName": {
      "Value": {
        "Fn::Select": [
          0,
          {
            "Fn::Split": [
              "/",
              {
                "Ref": "url"
              }
            ]
          }
        ]
      }
    }
  }
}
```
```yml
Parameters:
  url:
    Type: String
    Default: www.testDomain.com/part1/part2
Outputs:
  outputDomainName:
    Value: !Select
      - 0
      - !Split
        - /
        - !Ref 'url'
```

---

#### Fn::Sub <a name="sub"></a>

Used for for substituting values in strings. This is seen quite a bit when formatting strings. Things like cloudwatch dashboards, etc...

```json
{
  "Fn::Sub" : [
    "${protocol}://${domain}/${pathPart}",
    {
      "protocol": "https",
      "domain": "testDomain.com",
      "pathPart": "part1/part2"
    }
  ]
}
```
```yml
!Sub
- www.${domain}.com/${pathPart}
- domain: testDomain
  pathPart: part1/part2
```

##### Usage <a name="sub-usage"></a>

Refer to the above where we're building a domain name off `potentially` dynamic components.

The placeholders, and keys in the following map have to be indentical in case

---

#### Fn::Transform <a name="transform"></a>

A relatively new intrinsic function that allows you to invoke and take the returned fragment from a lambda function (custom or AWS managed), and embed in your template at the specified location.

```json
{
  "Fn::Transform" : {
    "Name" : "<<macroName>>",
    "Parameters" : {
      "<<param1Key>>" : "<<param1Value>>",
      "<<etc...>>" : "<<etc...>>"
    }
  }
}

```
```yml
!Transform
Name: <<macroName>>
Parameters:
  <<param1Key>>: <<param1Value>>
  <<etc...>>: <<etc...>>
```

##### Usage <a name="transform-usage"></a>

See <a href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-macros#inline">here for more information on using this function for inline transforms</a>

---

#### Ref <a name="ref"></a>

The most useful function to learn. When used against a parameter, it returns a value; and when used against a resource, it returns the default return property

<div class="card tip">
  <div class="card-body">
    When using this function you have to keep in mind the properties that the resource exposes, as not `every` resource is the same. You'll need to continually reference <a href = "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html">the docs</a> as this can be close to impossible to remember all the supported outputs per resource
  </div>
</div>

```json
{
  "Ref" : "resourceLogicalId"
}
```
```yml
!Ref 'resourceLogicalId'
```

##### Usage <a name="ref-usage"></a>

The below returns a bucket name to an output

```json
{
  "Resources": {
    "S3Bucket": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "AccessControl": "Private"
      }
    }
  },
  "Outputs": {
    "bucketName": {
      "Value": {
        "Ref": "S3Bucket"
      }
    }
  }
}
```
```yml
Resources:
  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: Private
Outputs:
  bucketName:
    Value: !Ref 'S3Bucket'
```
