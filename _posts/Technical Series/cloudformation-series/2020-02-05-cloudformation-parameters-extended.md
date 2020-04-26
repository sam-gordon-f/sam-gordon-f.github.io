---
layout: post
title: "Parameters - extended"
date: 2020-02-05 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Cloudformation template/stack Parameters
tags: [cloudformation, parameters, yml, json]
skill: intermediate
---

Below are a list of special lookup params, and examples on where they're useful and can be used

<div class="card tip">
  <div class="card-body">
    AWS special params cannot be used for optional parameters
  </div>
</div>
<div class="card tip">
  <div class="card-body">
    AWS special params may not be useful for when systems specify values, as they're more for user assistance and validation
  </div>
</div>
  <br>

1. [AWS::EC2::AvailabilityZone::Name](#aws-params-availability-zone-name)
2. [List\<AWS::EC2::AvailabilityZone::Name\>](#aws-params-list-availability-zone-name)
2. [AWS::EC2::Image::Id](#aws-params-image-id)
3. [AWS::EC2::Instance::Id](#aws-params-instance-id)
4. [AWS::EC2::KeyPair::KeyName](#aws-params-keypair-name)
5. [AWS::EC2::SecurityGroup::GroupName](#aws-params-security-group-name)
6. [AWS::EC2::SecurityGroup::Id](#aws-params-security-group-id)
7. [AWS::EC2::Subnet::Id](#aws-params-subnet-id)
8. [AWS::EC2::Volume::Id](#aws-params-volume-id)
9. [AWS::EC2::VPC::Id](#aws-params-vpc-id)
10. [AWS::Route53::HostedZone::Id](#aws-params-hosted-zone-id)


6. [SSM Parameters (systems manager)](#ssm-params)

---

<a name = "aws-params-availability-zone-name"></a>
##### AWS::EC2::AvailabilityZone::Name

```json
{
  "Parameters": {
    "EC2InstanceAvailabilityZone": {
      "Type": "AWS::EC2::AvailabilityZone::Name"
    }
  },
  "Resources": {
    "EC2Instance": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": {
          "Ref": "EC2InstanceAvailabilityZone"
        }
      }
    }
  }
}
```

<a name = "aws-params-list-availability-zone-name"></a>
##### List<AWS::EC2::AvailabilityZone::Name>

```json
{
  
}
```

<a name = "aws-params-image-id"></a>
##### AWS::EC2::Image::Id

```json
{
  "Parameters": {
    "EC2ImageId": {
      "Type": "AWS::EC2::Image::Id"
    }
  },
  "Resources": {
    "EC2Instance": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "ImageId": {
          "Ref": "EC2ImageId"
        }
      }
    }
  }
}
```

<a name = "aws-params-instance-id"></a>
##### AWS::EC2::Instance::Id

```json
{
  "Parameters": {
    "EC2InstanceId": {
      "Type": "AWS::EC2::Instance::Id"
    }
  },
  "Resources": {
    "EC2EIP": {
      "Type" : "AWS::EC2::EIP",
      "Properties" : {
        "InstanceId" : {
          "Ref": "EC2InstanceId"
        }
      }
    }
  }
}
```

<a name = "aws-params-keypair-name"></a>
##### AWS::EC2::KeyPair::KeyName

```json
{
  "Parameters": {
    "EC2KeyPairName": {
      "Type": "AWS::EC2::KeyPair::KeyName"
    }
  },
  "Resources": {
    "EC2Instance": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "KeyName": {
          "Ref": "EC2KeyPairName"
        }
      }
    }
  }
}
```

<a name = "aws-params-security-group-name"></a>
##### AWS::EC2::SecurityGroup::GroupName

```json
{
  "Parameters": {
    "EC2SecurityGroupName": {
      "Type": "AWS::EC2::SecurityGroup::GroupName"
    }
  },
  "Resources": {
    "EC2SecurityGroupIngress": {
      "Type" : "AWS::EC2::SecurityGroupIngress",
      "Properties" : {
        "GroupName" : {
          "Ref": "EC2SecurityGroupName"
        }
      }
    }
  }
}
```

<a name = "aws-params-security-group-id"></a>
##### AWS::EC2::SecurityGroup::Id

```json
{
  "Parameters": {
    "EC2SecurityGroupId": {
      "Type": "AWS::EC2::SecurityGroup::Id"
    }
  },
  "Resources": {
    "EC2SecurityGroupIngress": {
      "Type" : "AWS::EC2::SecurityGroupIngress",
      "Properties" : {
        "GroupId" : {
          "Ref": "EC2SecurityGroupId"
        }
      }
    }
  }
}
```

<a name = "aws-params-subnet-name"></a>
##### AWS::EC2::Subnet::Id

```json
{
  "Parameters": {
    "EC2SubnetId": {
      "Type": "AWS::EC2::Subnet::Id"
    }
  },
  "Resources": {
    "EC2SubnetRouteTableAssociation": {
      "Type" : "AWS::EC2::SubnetRouteTableAssociation",
      "Properties" : {
        "SubnetId" : {
          "Ref": "EC2SubnetId"
        }
      }
    }
  }
}
```

<a name = "aws-params-volume-id"></a>
##### AWS::EC2::Volume::Id
An Amazon EBS volume ID, such as vol-3cdd3f56.

<a name = "aws-params-vpc-id"></a>
##### AWS::EC2::VPC::Id
A VPC ID, such as vpc-a123baa3.

<a name = "aws-params-hosted-zone-id"></a>
##### AWS::Route53::HostedZone::Id
An Amazon Route 53 hosted zone ID, such as Z23YXV4OVPL04A.

##### List<AWS::EC2::AvailabilityZone::Name>
An array of Availability Zones for a region, such as us-west-2a, us-west-2b.

##### List<AWS::EC2::Image::Id>
An array of Amazon EC2 image IDs, such as ami-0ff8a91507f77f867, ami-0a584ac55a7631c0c. Note that the AWS CloudFormation console doesn't show a drop-down list of values for this parameter type.

##### List<AWS::EC2::Instance::Id>
An array of Amazon EC2 instance IDs, such as i-1e731a32, i-1e731a34.

##### List<AWS::EC2::SecurityGroup::GroupName>
An array of EC2-Classic or default VPC security group names, such as my-sg-abc, my-sg-def.

##### List<AWS::EC2::SecurityGroup::Id>
An array of security group IDs, such as sg-a123fd85, sg-b456fd85.

##### List<AWS::EC2::Subnet::Id>
An array of subnet IDs, such as subnet-123a351e, subnet-456b351e.

##### List<AWS::EC2::Volume::Id>
An array of Amazon EBS volume IDs, such as vol-3cdd3f56, vol-4cdd3f56.

#####List<AWS::EC2::VPC::Id>
An array of VPC IDs, such as vpc-a123baa3, vpc-b456baa3.

##### List<AWS::Route53::HostedZone::Id>
An array of Amazon Route 53 hosted zone IDs, such as Z23YXV4OVPL04A, Z23YXV4OVPL04B.

---

<a name = "ssm-params"></a>
#### SSM Parameters (systems manager)

AWS::SSM::Parameter::Name
The name of a Systems Manager parameter key.

Use this parameter when you want to pass the parameter key. For example, you can use this type to validate that the parameter exists.

AWS::SSM::Parameter::Value<String>
A Systems Manager parameter whose value is a string. This corresponds to the String parameter type in Parameter Store.

AWS::SSM::Parameter::Value<List<String>> or AWS::SSM::Parameter::Value<CommaDelimitedList>
A Systems Manager parameter whose value is a list of strings. This corresponds to the StringList parameter type in Parameter Store.

AWS::SSM::Parameter::Value<AWS-specific parameter type>
A Systems Manager parameter whose value is an AWS-specific parameter type. For example, the following specifies the AWS::EC2::KeyPair::KeyName type:

AWS::SSM::Parameter::Value<AWS::EC2::KeyPair::KeyPairName>

AWS::SSM::Parameter::Value<List<AWS-specific parameter type>>
A Systems Manager parameter whose value is a list of AWS-specific parameter types. For example, the following specifies a list of AWS::EC2::KeyPair::KeyName types:

AWS::SSM::Parameter::Value<List<AWS::EC2::KeyPair::KeyPairName>>
