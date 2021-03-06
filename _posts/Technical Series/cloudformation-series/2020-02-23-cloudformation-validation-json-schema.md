---
layout: post
title: "Validation - json-schema"
date: 2020-02-23 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Resources contained within a cloudformation template/stack
tags: [cloudformation, parameters, yml, json]
skill: intermediate
---

You can use JSON schemas to perform validation on your cloudformation templates. This provides a `templated` method for checking business logic conformity

In the below example. There are three components

1. [JSON Schema for S3 Bucket](#json-schema)
2. [Cloudformation Template](#cloudformation)
3. [Sample code to validate (ruby)](#ruby-validate)
  a. [Gemfile](#ruby-validate-gemfile)
  b. [Rakefile](#ruby-validate-rakefile)
  c. [Usage](#ruby-validate-usage)

---

<a name = "json-schema"></a>
#### 1) S3 Bucket JSON Schema

Below is a sample schema that checks against the values specified for the `AccessControl` property

```json
{
  "description": "AWS::S3::Bucket Schema",
  "type": "object",
  "properties": {
    "Type": {
      "type": "string"
    },
    "Properties": {
      "type": "object",
      "properties": {
        "AccessControl": {
          "type": "string",
          "enum": ["Private", "LogDeliveryWrite"]
        }
      },
      "required": [
        "AccessControl"
      ]
    }
  }
}
```

<br>

<a name = "cloudformation"></a>
#### 2) Template1 (cloudformation template to validate)

Here is a template that a user, or system could specify that we want to check against

```json
{
  "Resources": {
    "S3Bucket": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "AccessControl": "Private"
      }
    }
  }
}
```

<br>

<a name = "ruby-validate"></a>
#### 3) Sample Ruby project to check

Some sample code to run the validation. I'm using a ruby Rakefile for simplicity / portability

<a name = "ruby-validate-gemfile"></a>
##### 3a) Gemfile

```ruby
gem 'json-schema'
```

<br>

<a name = "ruby-validate-rakefile"></a>
##### 3b) Rakefile

```ruby
require 'json'
require 'json-schema'
require 'aws-sdk-cloudformation'

  # default folder for where your schemas reside
if ENV['schemaPath'] == '' || ENV['schemaPath'].nil?
  ENV['schemaPath'] = './schemas'
end

  # default project path to check
if ENV['projectPath'] == '' || ENV['projectPath'].nil?
  ENV['projectPath'] = './'
end

namespace :template do
  desc('validate cloudformation template against schemas')
  task validate: do
    begin
        # iterate over all files in directory
      Dir["#{ENV['projectPath']}/*.json"].each do |f|

          # parse template into map object
        cf_template = JSON.parse(File.read(f))
          # iterate over resources
        cf_template['Resources'].each do |cf_obj|
          next unless File.file?("#{ENV['schemaPath']}/#{cf_obj[1]['Type']}.json")
          begin
              # run json validator
            JSON::Validator.validate!(File.read("#{ENV['schemaPath']}/#{cf_obj[1]['Type']}.json"), cf_obj[1])
            puts "#{cf_obj[1]['Type']}: valid"

              # if validation fails
          rescue JSON::Schema::ValidationError => e
            message = "#{cf_obj[1]['Type']}: invalid #{e}"
            abort message
          end
        end
        puts "#{f}: valid"
      end

      # general exception
    rescue Exception => e
      abort "general error: #{e}"
    end
  end
end
```

<br>

<a name = "ruby-validate-usage"></a>
##### 3c) Usage
```shell
Rake template:validate
```
