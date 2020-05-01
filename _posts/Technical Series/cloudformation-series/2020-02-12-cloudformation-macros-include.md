---
layout: post
title: Macro - Include
date: 2020-02-12 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: S3 File Inclusions for Cloudformation templates
tags: [cloudformation, include, lambda, macro]
docs:
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-macros.html\">AWS docs on cloudformation Transforms</a>"
skill: intermediate
---

The Cloudformation Include Transform is an AWS managed transform that takes an S3 Key, finds the content, and merges with the template supplied.
  
In the below example, the main template (template2), includes a bucket defined in template1 are runtime.

1. [Template1 - template that is included](#template1)
2. [Template2 - template which runs the include](#template2)

---

<a name = "template1"></a>
##### template1 (template that is included)

```json
"S3Bucket1": {
  "Type" : "AWS::S3::Bucket",
  "Properties" : {
    "AccessControl" : "Private"
  }
}
```
```yml
---
S3Bucket1:
  Type: AWS::S3::Bucket
  Properties:
    AccessControl: "Private"
```

---

<a name = "template2"></a>
##### template2 (template which runs the include)

```json
{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description": "A description to help identify the purpose of the template",
  "Resources": {
    "S3Bucket2": {
      "Type" : "AWS::S3::Bucket",
      "Properties" : {
        "AccessControl" : "Private"
      }
    },
    "Fn::Transform": {
      "Name": "AWS::Include",
      "Parameters": {
        "Location": "s3://pathToS3TemplateAbove"
      }
    }
  }
}
```

```yml
---
AWSTemplateFormatVersion: "2010-09-09"
Description: "A description to help identify the purpose of the template"
Resources:
  S3Bucket1:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: "Private"
  'Fn::Transform':
    Name: "AWS::Include"
    Parameters:
      Location: "s3://pathToS3TemplateAbove"
```
