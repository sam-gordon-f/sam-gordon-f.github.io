---
layout: post
title: "Validation - cfn-lint"
date: 2020-02-03 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Resources contained within a cloudformation template/stack
tags: [cloudformation, parameters, yml, json]
prevPost:
  text: "Validation - Json Schemas"
  link: "/technical-series/cloudformation-series/cloudformation-validation-json-schema"
nextPost:
  text: "na"
  link: "/technical-series/cloudformation-series/na"
docs:
  - "<a href = \"https://github.com/aws-cloudformation/cfn-python-lint\">Github project for cfn-lint</a>"
skill: advanced
---

You can use cfn-lint to perform validation on your cloudformation templates. This provides a `programatic` method for checking business logic conformity

In the below example. There are three components

1. [Cloudformation Template](#cloudformation)
2. [Sample code to validate (ruby)](#ruby-validate)
  a. [Gemfile](#ruby-validate-gemfile)
  c. [Usage](#cfn-lint-usage)

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

<a name = "ruby-validate-usage"></a>
##### Usage
```shell
cfn-lint template1.yaml
```
