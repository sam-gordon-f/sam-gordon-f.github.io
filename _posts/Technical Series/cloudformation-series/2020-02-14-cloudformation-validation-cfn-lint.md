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
skill: proficient
tmp: https://binx.io/blog/2018/07/07/aws-cloudformation-validation-in-cicd-pipelines/
---

You can use cfn-lint to perform validation on your cloudformation templates. This provides a `programatic` method for checking business logic conformity

In the below example. There are four components. Each of these work together to prevent a user from creating a `Public` S3 Bucket (along with a whole heap of default checks)

1. [Cloudformation Template](#cloudformation)
2. [Sample custom validation rule (python)](#python-rule)
3. [Sample lint config file (yml)](#python-lint-file)
4. [Usage](#usage)

---

<a name = "cloudformation"></a>
#### Template1 (cloudformation template to validate)

The below is a file called `./cloudformation.template`
(this is standard template that you want to validate)

```json
{
  "Resources": {
    "S3Bucket": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "AccessControl": "Public"
      }
    }
  }
}
```

<a name = "python-rule"></a>
#### Sample custom validation rule (python)

The below is a file called `./append-rules/S3BucketsNotPublic.py`
(this is a specifically formatted cfn-lint rule python file)

```python
from cfnlint import CloudFormationLintRule
from cfnlint import RuleMatch

class S3BucketsNotPublic(CloudFormationLintRule):
  """Check if S3 Bucket is Not Public"""
  id = 'E9020'
  shortdesc = 'S3 Buckets must never be public'
  
  def match(self, cfn):
    matches = list()
    resources = cfn.get_resources(['AWS::S3::Bucket'])
    for name, bucket in resources.items():
      path = ['Resources', name, 'Properties']
      full_path = ('/'.join(str(x) for x in path))
      if isinstance(bucket, dict):
        props = bucket.get('Properties')
        if props:
          access_control = props.get('AccessControl')
          if access_control:
            forbidden_values = ['PublicRead','PublicReadWrite']
          if access_control in forbidden_values:
            message =  "Property AccessControl set to {0} is forbidden in {1}"
            matches.append(RuleMatch(
              path,
              message.format(access_control, full_path)
            ))
    return matches
```

---

<a name = "python-lint-file"></a>
#### Sample lint config file (config)

The below is a falled called `./.cfnlintrc` (the `.` is important)
(this is a specifically formatted cfn-lint config file)

```yml
templates:
- cloudformation.template
```

---

<a name = "usage"></a>
#### Usage

Run from the same directory as where your template is stored

```shell
cfn-lint --append-rules ./append-rules
```
