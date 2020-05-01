---
layout: post
title: "DSL - CFNDSL"
date: 2020-02-23 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: model your templates in a ruby DSL
tags: [cloudformation, parameters, ruby, json, dsl]
skill: proficient
---

Templates can be generated using a range of different languages. One such open source project is cfndsl (ruby)

In the below example. These are the areas that make up a solution

1. [Template](#template)
2. [Config](#config)
3. [Conversion](#conversion)
4. [Usage](#usage)
5. [Result](#result)

---

<a name = "template"></a>
#### Template

The below creates 'n' S3::Bucket(s) (with versioning), and Policies allowing another account to access
This is based on whats inside a config file thats merged at conversion time

```ruby
CloudFormation do
  AWSTemplateFormatVersion '2010-09-09'
  Description "cfndsl-example"

  for i in 1..bucket_count do
    Resource("S3Bucket#{i}") do
      Type('AWS::S3::Bucket')

      Property('AccessControl', 'Private')
      Property('VersioningConfiguration', {
        "Status" => "Enabled"
      })
    end

    Resource("S3BucketPolicy#{i}") do
      Type('AWS::S3::BucketPolicy')
    
      Property('Bucket', Ref("S3Bucket#{i}"))
      Property('PolicyDocument', {
        'Version' => '2012-10-17',
        'Statement' => [
          {
            'Sid' => '',
            'Effect' => 'Allow',
            'Principal' => {
              'AWS' => external_account
            },
            'Action' => 's3:GetObject',
            'Resource' => FnJoin('', [
              FnGetAtt("S3Bucket#{i}", 'Arn'),
              '/*'
            ])
          },
          {
            'Sid' => '',
            'Effect' => 'Allow',
            'Principal' => {
              'AWS' => external_account
            },
            'Action' => 's3:ListBucket',
            'Resource' => FnGetAtt("S3Bucket#{i}", 'Arn')
          }
        ]
      })
    end
  end
end
```

---

<a name = "config"></a>
#### Config

One of the powerful features is the abilty to use variables from a config (yml) file

```yml
---
external_account: "123456789123"
bucket_count: 3
```

---

<a name = "conversion"></a>
#### Conversion

Sample ruby rake file to merge some config, and convert the result to json

```ruby
require 'json'
require 'json-schema'
require 'cfndsl'

  # default project path to check
if ENV['projectPath'] == '' || ENV['projectPath'].nil?
  ENV['projectPath'] = './'
end

namespace :template do
  desc('convert cfndsl cloudformation template to json')
  task :convert do
    begin
      files = []
      Dir["#{ENV['projectPath']}/*.rb"].each do |template|
        files << template.to_s
      end

      extras = []
      Dir["#{ENV['projectPath']}/*.yml"].each do |extraConfigFile|
        extras << [:yaml, extraConfigFile]
      end

      files.each do |f|
        json = CfnDsl.eval_file_with_extras(
          f,
          extras
        ).to_json

        cf_template_new = File.new("#{((File.basename(f).gsub! 'rb', 'json'))}", 'w')
        cf_template_new.puts(json)
        cf_template_new.close

        puts "converted #{f} to json"
      end
    rescue Exception => e
      abort "error: #{e}"
    end
  end
end
```

---

<a name = "usage"></a>
#### Usage

```
rake template:convert
```

---

<a name = "result"></a>
#### Result

Sample output from the above steps

```json
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Description": "cfndsl-example",
  "Resources": {
    "S3Bucket1": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "AccessControl": "Private",
        "VersioningConfiguration": {
          "Status": "Enabled"
        }
      }
    },
    "S3BucketPolicy1": {
      "Type": "AWS::S3::BucketPolicy",
      "Properties": {
        "Bucket": {
          "Ref": "S3Bucket1"
        },
        "PolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [{
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
              "AWS": "123456789123"
            },
            "Action": "s3:GetObject",
            "Resource": {
              "Fn::Join": ["", [{
                "Fn::GetAtt": ["S3Bucket1", "Arn"]
              }, "/*"]]
            }
          }, {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
              "AWS": "123456789123"
            },
            "Action": "s3:ListBucket",
            "Resource": {
              "Fn::GetAtt": ["S3Bucket1", "Arn"]
            }
          }]
        }
      }
    },
    "S3Bucket2": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "AccessControl": "Private",
        "VersioningConfiguration": {
          "Status": "Enabled"
        }
      }
    },
    "S3BucketPolicy2": {
      "Type": "AWS::S3::BucketPolicy",
      "Properties": {
        "Bucket": {
          "Ref": "S3Bucket2"
        },
        "PolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [{
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
              "AWS": "123456789123"
            },
            "Action": "s3:GetObject",
            "Resource": {
              "Fn::Join": ["", [{
                "Fn::GetAtt": ["S3Bucket2", "Arn"]
              }, "/*"]]
            }
          }, {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
              "AWS": "123456789123"
            },
            "Action": "s3:ListBucket",
            "Resource": {
              "Fn::GetAtt": ["S3Bucket2", "Arn"]
            }
          }]
        }
      }
    },
    "S3Bucket3": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "AccessControl": "Private",
        "VersioningConfiguration": {
          "Status": "Enabled"
        }
      }
    },
    "S3BucketPolicy3": {
      "Type": "AWS::S3::BucketPolicy",
      "Properties": {
        "Bucket": {
          "Ref": "S3Bucket3"
        },
        "PolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [{
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
              "AWS": "123456789123"
            },
            "Action": "s3:GetObject",
            "Resource": {
              "Fn::Join": ["", [{
                "Fn::GetAtt": ["S3Bucket3", "Arn"]
              }, "/*"]]
            }
          }, {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
              "AWS": "123456789123"
            },
            "Action": "s3:ListBucket",
            "Resource": {
              "Fn::GetAtt": ["S3Bucket3", "Arn"]
            }
          }]
        }
      }
    }
  }
}
```
