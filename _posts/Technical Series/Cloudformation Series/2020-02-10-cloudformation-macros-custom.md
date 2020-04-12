---
layout: post
title: Macro - Custom
date: 2020-02-02 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Custom Macros for Cloudformation templates
tags: [cloudformation, include, lambda, macro]
---

<div class="card official-docs">
  <div class="card-body">
    <a href = "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-macros.html">AWS docs on cloudformation Transforms</a>
  </div>
</div>
<div class="card tip">
  <div class="card-body">
    You must define the macro `beforehand` in another template/stack before trying to run
  </div>
</div>
<div class="card tip">
  <div class="card-body">
    You can also use lambda alias's / versions when defining their ARNs in the macro below
  </div>
</div>
  <br>
<div>
  When defining your own custom macros, you need to create the lambda function / macro definition in advance.
  In the following two examples, there is already a lambda function created in the same account (named `lambdaFunction1`)
  <br><br>
  The referencer is using the macro in the header (see <a href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-macros">here</a> for more details)
</div>

---

template1 (definition)

```json
{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description": "A description to help identify the purpose of the template",
  "Resources": {
    "cloudformationMacro": {
      "Type" : "AWS::CloudFormation::Macro",
      "Properties" : {
        "Description" : "my testing macro",
        "FunctionName" : "arn:aws:lambda:${Region}:${Account}:function:lambdaFunction1",
        "Name" : "cloudformationMacro"
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
  cloudformationMacro:
    Type: AWS::CloudFormation::Macro
    Properties:
      Description: "my testing macro"
      FunctionName: "arn:aws:lambda:${Region}:${Account}:function:lambdaFunction1"
      Name: "cloudformationMacro"
```

---

template2 (referencing)

```json
{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description": "A description to help identify the purpose of the template",
  "Transform": ["cloudformationMacro"]
}
```

```yml
---
AWSTemplateFormatVersion: "2010-09-09"
Description: "A description to help identify the purpose of the template"
Transform: ["cloudformationMacro"]
```

<div class="container grid-xl">
  <div class="columns">
  <div class = "column col-3 col-md-4 col-sm-12 col-xs-12">
    <a style="height: auto; width:100%;" class="btn btn-success btn-lg btn-outline py-2 mt-4" href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-macros-include">Macros - Include</a>
  </div>
    <div class = "column col-6 col-md-4 col-sm-12 col-xs-12">
      
    </div>
    <div class="column col-3 col-md-4 col-sm-12 col-xs-12">
      <a style="height: auto; width:100%;" class="btn btn-success btn-lg btn-outline py-2 mt-4" href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-macros">Macros - Transforms</a>
    </div>
  </div>
</div>
