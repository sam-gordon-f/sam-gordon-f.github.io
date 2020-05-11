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
  
  var availabiliyZoneCount = event.params.availabilityZoneCount

  var mapping = {
    vpc: {
      cidr: "10.0.0.0/23"
    },
    subnets: {
      1: "10.0.0.0/27",
      2: "10.0.0.32/27",
      3: "10.0.0.64/27",
      4: "10.0.0.96/27",
      5: "10.0.0.128/27",
      6: "10.0.0.160/27",
      7: "10.0.0.192/27",
      8: "10.0.0.224/27",
      9: "10.0.1.0/27",
      10: "10.0.1.32/27",
      11: "10.0.1.64/27",
      12: "10.0.1.96/27"
    }
  }

  callback(null, {
      requestId: event.requestId,
      status: "success",
      fragment: mapping
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
  "Parameters": {
    "VPCAZCount": {
      "Type": "Number",
      "AllowedValues": [1, 2, 3]
    }
  },
  "Mappings": {
    "networkMapping": {
      "Fn::Transform": {
        "Name" : "macroVpcLayout",
        "Parameters" : {
          "availabilityZoneCount" : {
            "Ref": "VPCAZCount"
          }
        }
      }
    }
  },
  "Conditions": {
    "1AZ": {
      "Fn::Or": [{
        "Fn::Equals": [{
          "Ref": "VPCAZCount"
        }, "1"]
      }, {
        "Fn::Equals": [{
          "Ref": "VPCAZCount"
        }, "2"]
      }, {
        "Fn::Equals": [{
          "Ref": "VPCAZCount"
        }, "3"]
      }]
    },
    "2AZ": {
      "Fn::Or": [{
        "Fn::Equals": [{
          "Ref": "VPCAZCount"
        }, "2"]
      }, {
        "Fn::Equals": [{
          "Ref": "VPCAZCount"
        }, "3"]
      }]
    },
    "3AZ": {
      "Fn::Equals": [{
        "Ref": "VPCAZCount"
      }, "3"]
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
    },
    "EC2SubnetDMZAZ1": {
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
          "Fn::FindInMap": ["networkMapping", "subnets", "1"]
        },
        "MapPublicIpOnLaunch" : true,
        "VpcId" : {
          "Ref": "EC2VPC"
        }
      },
      "Condition": "1AZ"
    },
    "EC2SubnetWebAZ1": {
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
          "Fn::FindInMap": ["networkMapping", "subnets", "2"]
        },
        "MapPublicIpOnLaunch" : false,
        "VpcId" : {
          "Ref": "EC2VPC"
        }
      },
      "Condition": "1AZ"
    },
    "EC2SubnetDataAZ1": {
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
          "Fn::FindInMap": ["networkMapping", "subnets", "3"]
        },
        "MapPublicIpOnLaunch" : false,
        "VpcId" : {
          "Ref": "EC2VPC"
        }
      },
      "Condition": "1AZ"
    },
    "EC2SubnetAppAZ1": {
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
          "Fn::FindInMap": ["networkMapping", "subnets", "4"]
        },
        "MapPublicIpOnLaunch" : false,
        "VpcId" : {
          "Ref": "EC2VPC"
        }
      },
      "Condition": "1AZ"
    },
    "EC2SubnetDMZAZ2": {
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
          "Fn::FindInMap": ["networkMapping", "subnets", "5"]
        },
        "MapPublicIpOnLaunch" : true,
        "VpcId" : {
          "Ref": "EC2VPC"
        }
      },
      "Condition": "2AZ"
    },
    "EC2SubnetWebAZ2": {
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
          "Fn::FindInMap": ["networkMapping", "subnets", "6"]
        },
        "MapPublicIpOnLaunch" : false,
        "VpcId" : {
          "Ref": "EC2VPC"
        }
      },
      "Condition": "2AZ"
    },
    "EC2SubnetDataAZ2": {
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
          "Fn::FindInMap": ["networkMapping", "subnets", "7"]
        },
        "MapPublicIpOnLaunch" : false,
        "VpcId" : {
          "Ref": "EC2VPC"
        }
      },
      "Condition": "2AZ"
    },
    "EC2SubnetAppAZ2": {
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
          "Fn::FindInMap": ["networkMapping", "subnets", "8"]
        },
        "MapPublicIpOnLaunch" : false,
        "VpcId" : {
          "Ref": "EC2VPC"
        }
      },
      "Condition": "2AZ"
    },
    "EC2SubnetDMZAZ3": {
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
          "Fn::FindInMap": ["networkMapping", "subnets", "9"]
        },
        "MapPublicIpOnLaunch" : true,
        "VpcId" : {
          "Ref": "EC2VPC"
        }
      },
      "Condition": "3AZ"
    },
    "EC2SubnetWebAZ3": {
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
          "Fn::FindInMap": ["networkMapping", "subnets", "10"]
        },
        "MapPublicIpOnLaunch" : false,
        "VpcId" : {
          "Ref": "EC2VPC"
        }
      },
      "Condition": "3AZ"
    },
    "EC2SubnetDataAZ3": {
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
          "Fn::FindInMap": ["networkMapping", "subnets", "11"]
        },
        "MapPublicIpOnLaunch" : false,
        "VpcId" : {
          "Ref": "EC2VPC"
        }
      },
      "Condition": "2AZ"
    },
    "EC2SubnetAppAZ3": {
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
          "Fn::FindInMap": ["networkMapping", "subnets", "12"]
        },
        "MapPublicIpOnLaunch" : false,
        "VpcId" : {
          "Ref": "EC2VPC"
        }
      },
      "Condition": "3AZ"
    },
    "EC2InternetGateway": {
      "Type": "AWS::EC2::InternetGateway"
    },
    "EC2VPCGatewayAttachment": {
      "Type": "AWS::EC2::VPCGatewayAttachment",
      "Properties": {
        "InternetGatewayId": {
          "Ref": "EC2InternetGateway"
        },
        "VpcId": {
          "Ref": "EC2VPC"
        }
      }
    },
    "EC2EIPNatAZ1": {
      "Type": "AWS::EC2::EIP",
      "Properties": {
        "Domain": "vpc"
      },
      "Condition": "1AZ"
    },
    "EC2EIPNatAZ2": {
      "Type": "AWS::EC2::EIP",
      "Properties": {
        "Domain": "vpc"
      },
      "Condition": "2AZ"
    },
    "EC2EIPNatAZ3": {
      "Type": "AWS::EC2::EIP",
      "Properties": {
        "Domain": "vpc"
      },
      "Condition": "3AZ"
    },
    "EC2NatGatewayAZ1": {
      "Type": "AWS::EC2::NatGateway",
      "Properties": {
        "SubnetId": {
          "Ref": "EC2SubnetDMZAZ1"
        },
        "AllocationId": {
          "Fn::GetAtt": ["EC2EIPNatAZ1", "AllocationId"]
        }
      },
      "Condition": "1AZ"
    },
    "EC2NatGatewayAZ2": {
      "Type": "AWS::EC2::NatGateway",
      "Properties": {
        "SubnetId": {
          "Ref": "EC2SubnetDMZAZ2"
        },
        "AllocationId": {
          "Fn::GetAtt": ["EC2EIPNatAZ2", "AllocationId"]
        }
      },
      "Condition": "2AZ"
    },
    "EC2NatGatewayAZ3": {
      "Type": "AWS::EC2::NatGateway",
      "Properties": {
        "SubnetId": {
          "Ref": "EC2SubnetDMZAZ3"
        },
        "AllocationId": {
          "Fn::GetAtt": ["EC2EIPNatAZ3", "AllocationId"]
        }
      },
      "Condition": "3AZ"
    },
    "EC2RouteTableDMZ": {
      "Type": "AWS::EC2::RouteTable",
      "Properties": {
        "VpcId": {
          "Ref": "EC2VPC"
        }
      }
    },
    "EC2RouteTableAZ1": {
      "Type": "AWS::EC2::RouteTable",
      "Properties": {
        "VpcId": {
          "Ref": "EC2VPC"
        }
      },
      "Condition": "1AZ"
    },
    "EC2RouteTableAZ2": {
      "Type": "AWS::EC2::RouteTable",
      "Properties": {
        "VpcId": {
          "Ref": "EC2VPC"
        }
      },
      "Condition": "2AZ"
    },
    "EC2RouteTableAZ3": {
      "Type": "AWS::EC2::RouteTable",
      "Properties": {
        "VpcId": {
          "Ref": "EC2VPC"
        }
      },
      "Condition": "3AZ"
    },
    "EC2RouteInternetDMZ": {
      "Type": "AWS::EC2::Route",
      "Properties": {
        "DestinationCidrBlock": "0.0.0.0/0",
        "RouteTableId": {
          "Ref": "EC2RouteTableDMZ"
        },
        "GatewayId": {
          "Ref": "EC2InternetGateway"
        }
      }
    },
    "EC2RouteInternetAZ1": {
      "Type": "AWS::EC2::Route",
      "Properties": {
        "DestinationCidrBlock": "0.0.0.0/0",
        "RouteTableId": {
          "Ref": "EC2RouteTableAZ1"
        },
        "NatGatewayId": {
          "Ref": "EC2NatGatewayAZ1"
        }
      },
      "Condition": "1AZ"
    },
    "EC2RouteInternetAZ2": {
      "Type": "AWS::EC2::Route",
      "Properties": {
        "DestinationCidrBlock": "0.0.0.0/0",
        "RouteTableId": {
          "Ref": "EC2RouteTablePrivateAZ2"
        },
        "NatGatewayId": {
          "Ref": "EC2NatGatewayAZ2"
        }
      },
      "Condition": "2AZ"
    },
    "EC2RouteInternetAZ3": {
      "Type": "AWS::EC2::Route",
      "Properties": {
        "DestinationCidrBlock": "0.0.0.0/0",
        "RouteTableId": {
          "Ref": "EC2RouteTablePrivateAZ3"
        },
        "NatGatewayId": {
          "Ref": "EC2NatGatewayAZ3"
        }
      },
      "Condition": "3AZ"
    }
  }
}
```
