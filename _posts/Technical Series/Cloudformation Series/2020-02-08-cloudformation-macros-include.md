---
layout: post
title: Macro - Include
date: 2020-02-02 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: S3 File Inclusions for Cloudformation templates
tags: [cloudformation, include, lambda, macro]
---

<div class="card official-docs">
  <div class="card-body">
    <a href = "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-macros.html">AWS docs on cloudformation Transforms</a>
  </div>
</div>
  <br>
<div>
  The Cloudformation S3 Include Transform is an AWS managed transform that takes an S3 Key, finds the content, and merges with the template supplied.
    <br><br>  
  In the below example, the main template (template2), includes a bucket defined in template1 are runtime
</div>

---

template1 (file to include)

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

template2 (transform template)

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

<div class="container grid-xl">
  <div class="columns">
    <div class = "column col-3 col-md-4 col-sm-12 col-xs-12">
      <a style="height: auto; width:100%;" class="btn btn-success btn-lg btn-outline py-2 mt-4" href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-macros">Macros</a>
    </div>
    <div class = "column col-6 col-md-4 col-sm-12 col-xs-12">
      
    </div>
    <div class="column col-3 col-md-4 col-sm-12 col-xs-12">
      <a style="height: auto; width:100%;" class="btn btn-success btn-lg btn-outline py-2 mt-4" href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-macros-serverless">Macros - Serverless</a>
    </div>
  </div>
</div>
