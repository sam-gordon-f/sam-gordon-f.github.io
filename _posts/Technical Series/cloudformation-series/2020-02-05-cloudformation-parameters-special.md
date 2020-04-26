---
layout: post
title: "Parameters - Special"
date: 2020-02-05 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Cloudformation Special lookup parameters
tags: [cloudformation, parameters, yml, json]
skill: intermediate
---

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

Below are a list of special lookup params, and examples on where they're useful and can be used

#### Special Parameters
1. [AWS::EC2::AvailabilityZone::Name](#aws-params-availability-zone-name)
2. [List\<AWS::EC2::AvailabilityZone::Name\>](#aws-params-list-availability-zone-name)
3. [AWS::EC2::Image::Id](#aws-params-image-id)
4. [List\<AWS::EC2::Image::Id\>](#aws-params-list-image-id)
5. [AWS::EC2::Instance::Id](#aws-params-instance-id)
6. [List\<AWS::EC2::Instance::Id\>](#aws-params-list-instance-id)
7. [AWS::EC2::KeyPair::KeyName](#aws-params-keypair-name)
8. [AWS::EC2::SecurityGroup::GroupName](#aws-params-security-group-name)
9. [List\<AWS::EC2::SecurityGroup::GroupName\>](#aws-params-list-security-group-name)
10. [AWS::EC2::SecurityGroup::Id](#aws-params-security-group-id)
11. [List\<AWS::EC2::SecurityGroup::Id\>](#aws-params-list-security-group-id)
12. [AWS::EC2::Subnet::Id](#aws-params-subnet-id)
13. [List\<AWS::EC2::Subnet::Id\>](#aws-params-list-subnet-id)
14. [AWS::EC2::Volume::Id](#aws-params-volume-id)
15. [List\<AWS::EC2::Volume::Id\>](#aws-params-list-volume-id)
16. [AWS::EC2::VPC::Id](#aws-params-vpc-id)
17. [List\<AWS::EC2::VPC::Id\>](#aws-params-list-vpc-id)
18. [AWS::Route53::HostedZone::Id](#aws-params-hosted-zone-id)
19. [List\<AWS::Route53::HostedZone::Id\>](#aws-params-list-hosted-zone-id)
#### SSM Paramaters
20. [SSM Parameters (systems manager)](#ssm-params)

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
##### List\<AWS::EC2::AvailabilityZone::Name\>

```json
{
  "Parameters": {
    "ListEC2InstanceAvailabilityZone": {
      "Type": "List<AWS::EC2::AvailabilityZone::Name>"
    }
  },
  "Resources": {
    "ElasticLoadBalancingLoadBalancer": {
      "Type" : "AWS::ElasticLoadBalancing::LoadBalancer",
      "Properties" : {
        "AvailabilityZones" : {
          "Ref": "ListEC2InstanceAvailabilityZone"
        }
      }
    }
  }
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

<a name = "aws-params-list-image-id"></a>
##### List<AWS::EC2::Image::Id>

```json
{
  "Parameters": {
    "ListEC2ImageId": {
      "Type": "List<AWS::EC2::Image::Id>"
    }
  },
  "Resources": {
    "ConfigConfigRule": {
      "Type" : "AWS::Config::ConfigRule",
      "Properties" : {
        "InputParameters": {
          "amiIds": {
            "Ref": "ListEC2ImageId"
          }
        },
        "Source": {
          "Owner": "AWS",
          "SourceIdentifier": "APPROVED_AMIS_BY_ID"
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

<a name = "aws-params-list-instance-id"></a>
##### List\<AWS::EC2::Instance::Id\>

```
# No example provided
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

<a name = "aws-params-list-security-group-name"></a>
##### List\<AWS::EC2::SecurityGroup::GroupName\>

```
# no example provided
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

<a name = "aws-params-list-security-group-id"></a>
##### List\<AWS::EC2::SecurityGroup::Id\>

```
# no example provided
```

<a name = "aws-params-subnet-id"></a>
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

<a name = "aws-params-list-subnet-id"></a>
##### List\<AWS::EC2::Subnet::Id\>

```json
{
  "Parameters": {
    "ListEC2Subnet": {
      "Type": "List<AWS::EC2::Subnet::Id>"
    }
  },
  "Resources": {
    "ElasticLoadBalancingLoadBalancer": {
      "Type" : "AWS::ElasticLoadBalancing::LoadBalancer",
      "Properties" : {
        "Subnets" : {
          "Ref": "ListEC2Subnet"
        }
      }
    }
  }
}
```

<a name = "aws-params-volume-id"></a>
##### AWS::EC2::Volume::Id

```json
{
  "Parameters": {
    "EC2VolumeId": {
      "Type": "AWS::EC2::Volume::Id"
    }
  },
  "Resources": {
    "EC2Instance": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "Volumes": [
          {
            "Volume": {
              "Ref": "EC2VolumeId"
            }
          }
        ]
      }
    }
  }
}
```

<a name = "aws-params-list-volume-id"></a>
##### List\<AWS::EC2::Volume::Id\>

```
# no example provided
```

<a name = "aws-params-vpc-id"></a>
##### AWS::EC2::VPC::Id

```json
{
  "Parameters": {
    "EC2VPCId": {
      "Type": "AWS::EC2::VPC::Id"
    }
  },
  "Resources": {
    "EC2Subnet": {
      "Type" : "AWS::EC2::Subnet",
      "Properties" : {
        "VpcId" : {
          "Ref": "EC2VPCId"
        }
      }
    }
  }
}
```

<a name = "aws-params-list-vpc-id"></a>
##### List\<AWS::EC2::VPC::Id\>

```
# no example provided
```

<a name = "aws-params-hosted-zone-id"></a>
##### AWS::Route53::HostedZone::Id

```json
{
  "Parameters": {
    "Route53HostedZoneId": {
      "Type": "AWS::Route53::HostedZone::Id"
    }
  },
  "Resources": {
    "Route53RecordSet": {
      "Type" : "AWS::Route53::RecordSet",
      "Properties" : {
        "HostedZoneId" : {
          "Ref": "Route53RecordSet"
        }
      }
    }
  }
}
````

<a name = "aws-params-list-hosted-zone-id"></a>
##### List\<AWS::Route53::HostedZone::Id\>

```
# no example provided
```

---

<a name = "ssm-params"></a>
#### SSM Parameters (systems manager)

##### AWS::SSM::Parameter::Name

##### AWS::SSM::Parameter::Value<String>

##### AWS::SSM::Parameter::Value<List<String>> or AWS::SSM::Parameter::Value<CommaDelimitedList>

##### AWS::SSM::Parameter::Value<AWS-specific parameter type>
A Systems Manager parameter whose value is an AWS-specific parameter type. For example, the following specifies the AWS::EC2::KeyPair::KeyName type:

##### AWS::SSM::Parameter::Value<AWS::EC2::KeyPair::KeyPairName>

##### AWS::SSM::Parameter::Value<List<AWS-specific parameter type>>
A Systems Manager parameter whose value is a list of AWS-specific parameter types. For example, the following specifies a list of AWS::EC2::KeyPair::KeyName types:

AWS::SSM::Parameter::Value<List<AWS::EC2::KeyPair::KeyPairName>>
