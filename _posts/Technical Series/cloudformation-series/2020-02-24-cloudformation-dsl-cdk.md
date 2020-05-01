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
#### json-schema (AWS::S3::Bucket)

More information about json-schemas <a href = \"https://json-schema.org/\">here</a>

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

---

<a name = "cloudformation"></a>
#### Template1 (cloudformation template to validate)

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

---

<a name = "ruby-validate"></a>
#### Sample Ruby project to check

<a name = "ruby-validate-gemfile"></a>
##### Gemfile
```ruby
gem 'json-schema'
```

<a name = "ruby-validate-rakefile"></a>
##### Rakefile
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

<a name = "ruby-validate-usage"></a>
##### Usage
```shell
Rake template:validate
```
