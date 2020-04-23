---
layout: post
title: "Validation - cfn-lint"
date: 2020-02-03 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Resources contained within a cloudformation template/stack
tags: [cloudformation, parameters, yml, json]
docs:
  - "<a href = \"https://github.com/aws-cloudformation/cfn-python-lint\">Github project for cfn-lint</a>"
skill: proficient
tmp: https://binx.io/blog/2018/07/07/aws-cloudformation-validation-in-cicd-pipelines/
---

You can use cfn-lint to perform validation on your cloudformation templates. This provides a `programatic` method for checking business logic conformity

In the below example. There are four components. Each of these work together to prevent a user from creating a `Public` S3 Bucket (along with a whole heap of default checks)

1. [Cloudformation Template](#cloudformation)
2. [Sample custom validation rule (python)](#python-rule)
3. [Sample Spec file (*optional)](#cfn-sample-spec-file)
4. [Usage](#usage)
5. [Full Example](#full-example)

---

<a name = "cloudformation"></a>
#### Template1 (cloudformation template to validate)

The below is a file called `./cloudformation.template`
(this is standard template that you want to validate)

```json
{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description": "A description to help identify the purpose of the template",
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

<a name = "cfn-sample-spec-file"></a>
#### Sample Spec File (optional)

This forces the user to specify the property in the template and not rely on defaults.
In this example its not required as the python rule should capture. However it could be an easy alternative for required properties (`not values`)

```json
{
  "ResourceTypes": {
    "AWS::S3::Bucket": {
      "Properties": {
        "AccessControl": {
          "Required": false
        }
      }
    }
  }
}

```

---

<a name = "usage"></a>
#### Usage

Run from the same directory as where your template is stored

```shell
cfn-lint \
  --template cloudformation.template \
  --append-rules ./append-rules \
  --info

# with spec file (*optional)
cfn-lint \
  --template cloudformation.template \
  --append-rules ./append-rules \
  --override-specs ./override-spec/spec.json \
  --info
```

---

<a name = "full-example"></a>
#### Full Example

<a href = "https://github.com/sam-gordon-f/sam-gordon-f.github.io/tree/master/examples/technical-series/cloudformation-series/cloudformation-validate-cfn-lint">available here</a>
