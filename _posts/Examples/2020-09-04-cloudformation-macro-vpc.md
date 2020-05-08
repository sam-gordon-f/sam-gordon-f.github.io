---
layout: post
title: Cloudformation Macro built VPC
date: 2020-09-03 08:44:38
category: [examples]
author: samGordon
short-description: create a full working VPC with cloudformation "and macros"
tags: [cloudformation, lambda, macro]
skill: expert
---

The below example creates a fully working VPC that changes its topology based on parameters

1. [Subnet Split](#subnet-information)
2. [Cloudformation template](#template)

---

<a name = "subnet-information"></a>
##### 1) Subnet Information

<div class="card tip">
  <div class="card-body">
    Because we're using the intrinsic function Fn::Cidr. It `evenly` carves the CIDR's, which means its not as flexible as allocating yourself (But it does save a heap of time, at the expense of not having the most perfect allocation)
  </div>
</div>

The following builds a vpc with subnets structured like the following

<table class = "table" style = "width:100%;">
  <tr>
    <th>
      VPC Size
    </th>
    <th>
      AZ Count
    </th>
    <th>
      Allocation AZ1
    </th>
    <th>
      Allocation AZ2
    </th>
    <th>
      Allocation AZ3
    </th>
    <th>
      Hosts free / Hosts Total / Hosts Lost
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
    <td>
      na
    </td>
    <td>
      na
    </td>
    <td valign = "top">
      256 / 256 / 0
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td valign = "top">
      2AZ
    </td>
    <td>
      32<br> 32<br> 32<br> 32
    </td>
    <td>
      32<br> 32<br> 32<br> 32
    </td>
    <td>
      na
    </td>
    <td valign = "top">
      256 / 256 / 0
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td valign = "top">
      3AZ
    </td>
    <td>
      16<br> 16<br> 16<br> 16
    </td>
    <td>
      16<br> 16<br> 16<br> 16
    </td>
    <td>
      16<br> 16<br> 16<br> 16
    </td>
    <td valign = "top">
      192 / 256 / 64
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
    <td>
      na
    </td>
    <td>
      na
    </td>
    <td valign = "top">
      512 / 512 / 0
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td valign = "top">
      2AZ
    </td>
    <td>
      64<br> 64<br> 64<br> 64
    </td>
    <td>
      64<br> 64<br> 64<br> 64
    </td>    
    <td>
      na
    </td>
    <td valign = "top">
      512 / 512 / 0
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td valign = "top">
      3AZ
    </td>
    <td>
      32<br> 32<br> 32<br> 32<br>  
    </td>
    <td>
      32<br> 32<br> 32<br> 32<br>  
    </td>
    <td>
      32<br> 32<br> 32<br> 32<br>  
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
    <td>
      na
    </td>
    <td>
      na
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
      128<br> 128<br> 128<br> 128
    </td>
    <td>
      128<br> 128<br> 128<br> 128
    </td>
    <td>
      na
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
    <td>
      64<br> 64<br> 64<br> 64
    </td>
    <td>
      64<br> 64<br> 64<br> 64
    </td>
    <td>
      64<br> 64<br> 64<br> 64
    </td>
    <td valign = "top">
      768 / 1024 (256 loss)
    </td>
  </tr>
</table>

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
    },
    "VPCCidr": {
      "Type": "String",
      "AllowedPattern": "^([0-9]{1,3}\\.){3}[0-9]{1,3}(\/)(24|23|22)$"
    }
  },
  "Mappings": {
    "subnetBits": {
      "24": {
        "1": "6",
        "2": "5",
        "3": "4"
      },
      "23": {
        "1": "7",
        "2": "6",
        "3": "5"
      },
      "22": {
        "1": "8",
        "2": "7",
        "3": "6"
      }
    },
    "subnetCount": {
      "AvailabilityZones": {
        "1": "4",
        "2": "8",
        "3": "12"
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
          "Ref": "VPCCidr"
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
          "Fn::Select": [
            0,
            {
              "Fn::Cidr": [{
                  "Ref": "VPCCidr"
                },
                {
                  "Fn::FindInMap": [
                    "subnetCount",
                    "AvailabilityZones", {
                      "Ref": "VPCAZCount"
                    }
                  ]
                },
                {
                  "Fn::FindInMap": [
                    "subnetBits", {
                      "Fn::Select": [
                        1, {
                          "Fn::Split": [
                            "/", {
                              "Ref": "VPCCidr"
                            }
                          ]
                        }
                      ]
                    }, {
                      "Ref": "VPCAZCount"
                    }
                  ]
                }
              ]
            }
          ]
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
          "Fn::Select": [
            1,
            {
              "Fn::Cidr": [{
                  "Ref": "VPCCidr"
                },
                {
                  "Fn::FindInMap": [
                    "subnetCount",
                    "AvailabilityZones", {
                      "Ref": "VPCAZCount"
                    }
                  ]
                },
                {
                  "Fn::FindInMap": [
                    "subnetBits", {
                      "Fn::Select": [
                        1, {
                          "Fn::Split": [
                            "/", {
                              "Ref": "VPCCidr"
                            }
                          ]
                        }
                      ]
                    }, {
                      "Ref": "VPCAZCount"
                    }
                  ]
                }
              ]
            }
          ]
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
          "Fn::Select": [
            2,
            {
              "Fn::Cidr": [{
                  "Ref": "VPCCidr"
                },
                {
                  "Fn::FindInMap": [
                    "subnetCount",
                    "AvailabilityZones", {
                      "Ref": "VPCAZCount"
                    }
                  ]
                },
                {
                  "Fn::FindInMap": [
                    "subnetBits", {
                      "Fn::Select": [
                        1, {
                          "Fn::Split": [
                            "/", {
                              "Ref": "VPCCidr"
                            }
                          ]
                        }
                      ]
                    }, {
                      "Ref": "VPCAZCount"
                    }
                  ]
                }
              ]
            }
          ]
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
          "Fn::Select": [
            3,
            {
              "Fn::Cidr": [{
                  "Ref": "VPCCidr"
                },
                {
                  "Fn::FindInMap": [
                    "subnetCount",
                    "AvailabilityZones", {
                      "Ref": "VPCAZCount"
                    }
                  ]
                },
                {
                  "Fn::FindInMap": [
                    "subnetBits", {
                      "Fn::Select": [
                        1, {
                          "Fn::Split": [
                            "/", {
                              "Ref": "VPCCidr"
                            }
                          ]
                        }
                      ]
                    }, {
                      "Ref": "VPCAZCount"
                    }
                  ]
                }
              ]
            }
          ]
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
          "Fn::Select": [
            4,
            {
              "Fn::Cidr": [{
                  "Ref": "VPCCidr"
                },
                {
                  "Fn::FindInMap": [
                    "subnetCount",
                    "AvailabilityZones", {
                      "Ref": "VPCAZCount"
                    }
                  ]
                },
                {
                  "Fn::FindInMap": [
                    "subnetBits", {
                      "Fn::Select": [
                        1, {
                          "Fn::Split": [
                            "/", {
                              "Ref": "VPCCidr"
                            }
                          ]
                        }
                      ]
                    }, {
                      "Ref": "VPCAZCount"
                    }
                  ]
                }
              ]
            }
          ]
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
          "Fn::Select": [
            5,
            {
              "Fn::Cidr": [{
                  "Ref": "VPCCidr"
                },
                {
                  "Fn::FindInMap": [
                    "subnetCount",
                    "AvailabilityZones", {
                      "Ref": "VPCAZCount"
                    }
                  ]
                },
                {
                  "Fn::FindInMap": [
                    "subnetBits", {
                      "Fn::Select": [
                        1, {
                          "Fn::Split": [
                            "/", {
                              "Ref": "VPCCidr"
                            }
                          ]
                        }
                      ]
                    }, {
                      "Ref": "VPCAZCount"
                    }
                  ]
                }
              ]
            }
          ]
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
          "Fn::Select": [
            6,
            {
              "Fn::Cidr": [{
                  "Ref": "VPCCidr"
                },
                {
                  "Fn::FindInMap": [
                    "subnetCount",
                    "AvailabilityZones", {
                      "Ref": "VPCAZCount"
                    }
                  ]
                },
                {
                  "Fn::FindInMap": [
                    "subnetBits", {
                      "Fn::Select": [
                        1, {
                          "Fn::Split": [
                            "/", {
                              "Ref": "VPCCidr"
                            }
                          ]
                        }
                      ]
                    }, {
                      "Ref": "VPCAZCount"
                    }
                  ]
                }
              ]
            }
          ]
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
          "Fn::Select": [
            7,
            {
              "Fn::Cidr": [{
                  "Ref": "VPCCidr"
                },
                {
                  "Fn::FindInMap": [
                    "subnetCount",
                    "AvailabilityZones", {
                      "Ref": "VPCAZCount"
                    }
                  ]
                },
                {
                  "Fn::FindInMap": [
                    "subnetBits", {
                      "Fn::Select": [
                        1, {
                          "Fn::Split": [
                            "/", {
                              "Ref": "VPCCidr"
                            }
                          ]
                        }
                      ]
                    }, {
                      "Ref": "VPCAZCount"
                    }
                  ]
                }
              ]
            }
          ]
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
          "Fn::Select": [
            8,
            {
              "Fn::Cidr": [{
                  "Ref": "VPCCidr"
                },
                {
                  "Fn::FindInMap": [
                    "subnetCount",
                    "AvailabilityZones", {
                      "Ref": "VPCAZCount"
                    }
                  ]
                },
                {
                  "Fn::FindInMap": [
                    "subnetBits", {
                      "Fn::Select": [
                        1, {
                          "Fn::Split": [
                            "/", {
                              "Ref": "VPCCidr"
                            }
                          ]
                        }
                      ]
                    }, {
                      "Ref": "VPCAZCount"
                    }
                  ]
                }
              ]
            }
          ]
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
          "Fn::Select": [
            9,
            {
              "Fn::Cidr": [{
                  "Ref": "VPCCidr"
                },
                {
                  "Fn::FindInMap": [
                    "subnetCount",
                    "AvailabilityZones", {
                      "Ref": "VPCAZCount"
                    }
                  ]
                },
                {
                  "Fn::FindInMap": [
                    "subnetBits", {
                      "Fn::Select": [
                        1, {
                          "Fn::Split": [
                            "/", {
                              "Ref": "VPCCidr"
                            }
                          ]
                        }
                      ]
                    }, {
                      "Ref": "VPCAZCount"
                    }
                  ]
                }
              ]
            }
          ]
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
          "Fn::Select": [
            10,
            {
              "Fn::Cidr": [{
                  "Ref": "VPCCidr"
                },
                {
                  "Fn::FindInMap": [
                    "subnetCount",
                    "AvailabilityZones", {
                      "Ref": "VPCAZCount"
                    }
                  ]
                },
                {
                  "Fn::FindInMap": [
                    "subnetBits", {
                      "Fn::Select": [
                        1, {
                          "Fn::Split": [
                            "/", {
                              "Ref": "VPCCidr"
                            }
                          ]
                        }
                      ]
                    }, {
                      "Ref": "VPCAZCount"
                    }
                  ]
                }
              ]
            }
          ]
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
          "Fn::Select": [
            11,
            {
              "Fn::Cidr": [{
                  "Ref": "VPCCidr"
                },
                {
                  "Fn::FindInMap": [
                    "subnetCount",
                    "AvailabilityZones", {
                      "Ref": "VPCAZCount"
                    }
                  ]
                },
                {
                  "Fn::FindInMap": [
                    "subnetBits", {
                      "Fn::Select": [
                        1, {
                          "Fn::Split": [
                            "/", {
                              "Ref": "VPCCidr"
                            }
                          ]
                        }
                      ]
                    }, {
                      "Ref": "VPCAZCount"
                    }
                  ]
                }
              ]
            }
          ]
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
