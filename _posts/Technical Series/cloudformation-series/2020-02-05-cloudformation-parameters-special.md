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
1. [AWS::EC2::AvailabilityZone::Name](#aws-params-availability-zone-name)<span style = "color:orange">* </span>
3. [AWS::EC2::Image::Id](#aws-params-image-id)<span style = "color:orange">* </span>
5. [AWS::EC2::Instance::Id](#aws-params-instance-id)<span style = "color:orange">* </span>
7. [AWS::EC2::KeyPair::KeyName](#aws-params-keypair-name)
8. [AWS::EC2::SecurityGroup::GroupName](#aws-params-security-group-name)<span style = "color:orange">* </span>
10. [AWS::EC2::SecurityGroup::Id](#aws-params-security-group-id)<span style = "color:orange">* </span>
12. [AWS::EC2::Subnet::Id](#aws-params-subnet-id)<span style = "color:orange">* </span>
14. [AWS::EC2::Volume::Id](#aws-params-volume-id)<span style = "color:orange">* </span>
16. [AWS::EC2::VPC::Id](#aws-params-vpc-id)<span style = "color:orange">* </span>
18. [AWS::Route53::HostedZone::Id](#aws-params-hosted-zone-id)<span style = "color:orange">* </span>

(<span style = "color:orange">* </span> has support for generic lists `list<paramType>>`)

#### SSM Paramaters
  
1. [Overview](#ssm-params)

---

<a name = "aws-params-availability-zone-name"></a>
##### AWS::EC2::AvailabilityZone::Name

```json
{
  "Parameters": {
    "EC2InstanceAvailabilityZone": {
      "Type": "AWS::EC2::AvailabilityZone::Name"
    },
    "ListEC2InstanceAvailabilityZone": {
      "Type": "List<AWS::EC2::AvailabilityZone::Name>"
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
    },
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
    },
    "ListEC2ImageId": {
      "Type": "List<AWS::EC2::Image::Id>"
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
    },
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
    },
    "ListEC2InstanceId": {
      "Type": "List<AWS::EC2::Instance::Id>"
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
    },
    "LambdaFunction": {
      "Type": "AWS::Lambda::Function",
      "Properties" : {
        "Environment" : {
          "Variables": {
            "InstanceIds": {
              "Ref": "ListEC2InstanceId"
            }
          }
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
    },
    "ListEC2SecurityGroupName": {
      "Type": "List<AWS::EC2::SecurityGroup::GroupName>"
    }
  },
  "Resources": {
    "EC2SecurityGroupIngress1": {
      "Type" : "AWS::EC2::SecurityGroupIngress",
      "Properties" : {
        "GroupName" : {
          "Ref": "EC2SecurityGroupName"
        }
      }
    },
    "EC2SecurityGroupIngress2": {
      "Type" : "AWS::EC2::SecurityGroupIngress",
      "Properties" : {
        "GroupName" : {
          "Fn::Select": [2, "ListEC2SecurityGroupName"]
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
    },
    "ListEC2SecurityGroupId": {
      "Type": "List<AWS::EC2::SecurityGroup::Id>"
    }
  },
  "Resources": {
    "EC2SecurityGroupIngress1": {
      "Type" : "AWS::EC2::SecurityGroupIngress",
      "Properties" : {
        "GroupId" : {
          "Ref": "EC2SecurityGroupId"
        }
      }
    },
    "EC2SecurityGroupIngress2": {
      "Type" : "AWS::EC2::SecurityGroupIngress",
      "Properties" : {
        "GroupName" : {
          "Fn::Select": [1, "ListEC2SecurityGroupId"]
        }
      }
    }
  }
}
```

<a name = "aws-params-subnet-id"></a>
##### AWS::EC2::Subnet::Id

```json
{
  "Parameters": {
    "EC2SubnetId": {
      "Type": "AWS::EC2::Subnet::Id"
    },
    "ListEC2SubnetId": {
      "Type": "List<AWS::EC2::Subnet::Id>"
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
    },
    "ElasticLoadBalancingLoadBalancer": {
      "Type" : "AWS::ElasticLoadBalancing::LoadBalancer",
      "Properties" : {
        "Subnets" : {
          "Ref": "ListEC2SubnetId"
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
    },
    "ListEC2VolumeId": {
      "Type": "List<AWS::EC2::Volume::Id>"
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

<a name = "aws-params-vpc-id"></a>
##### AWS::EC2::VPC::Id

```json
{
  "Parameters": {
    "EC2VPCId": {
      "Type": "AWS::EC2::VPC::Id"
    },
    "ListEC2VPCId": {
      "Type": "List<AWS::EC2::VPC::Id>"
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

<a name = "aws-params-hosted-zone-id"></a>
##### AWS::Route53::HostedZone::Id

```json
{
  "Parameters": {
    "Route53HostedZoneId": {
      "Type": "AWS::Route53::HostedZone::Id"
    },
    "ListRoute53HostedZoneId": {
      "Type": "List<AWS::Route53::HostedZone::Id>"
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

---

<a name = "ssm-params"></a>
#### SSM Parameters (systems manager)

SSM Parameters are interesting, because you're essentially providing a reference to a value thats stored inside the `parameter store` feature of systems manager. These are resolved at the time of the cloudformation operation (create / update)

<div class="card tip">
  <div class="card-body">
    Macros and transforms can use these values, which can add a whole heap of creative solutions
  </div>
</div>

For example I could have a parameter (type: `String`)<br>
with the key: `/development/applicationA/propertyN`<br>
with the value `https://integrationServiceA.com`<br>
which can be referenced via

```json
{
  "Parameters": {
    "SSMParameter": {
      "Type": "AWS::SSM::Parameter::Value<List<String>>",
      "Default": "/development/applicationA/propertyN"
    }
  },
  "Resources": {
    "LambdaFunction": {
      "Type": "AWS::Lambda::Function",
      "Properties": {
        "Environment": {
          "Variables": {
            "propertyN": {
              "Ref": "SSMParameter"
            }
          }
        }
      }
    }
  }
}

```
