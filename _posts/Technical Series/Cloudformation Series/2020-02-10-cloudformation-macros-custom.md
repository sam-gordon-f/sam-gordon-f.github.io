---
layout: post
title: Macro - Custom
date: 2020-02-02 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Custom Macros for Cloudformation templates
tags: [cloudformation, include, lambda, macro]
prevPost:
  text: "Macros"
  link: "/technical-series/cloudformation-series/cloudformation-macros-serverless"
docs:
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-macros.html\">AWS docs on cloudformation Transforms</a>"
tips:
  - "You must define the macro `beforehand` in another template/stack before trying to run"
  - "You can also use lambda alias's / versions when defining their ARNs in the macro below"
skill: five
---

When defining your own custom macros, you need to create the lambda function / macro definition in advance.
In the following two examples, there is already a lambda function created in the same account (named `lambdaFunction1`)
<br><br>
The referencer is using the macro in the header (see <a href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-macros">here</a> for more details)

---

template1 (definition)

testing rouge 1
{% highlight JSON %}
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
{% endhighlight %}

{% highlight YAML %}
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
{% endhighlight %}

---

template2 (referencing)

{% highlight JSON %}
{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description": "A description to help identify the purpose of the template",
  "Transform": ["cloudformationMacro"]
}
{% endhighlight %}

{% highlight YAML %}
---
AWSTemplateFormatVersion: "2010-09-09"
Description: "A description to help identify the purpose of the template"
Transform: ["cloudformationMacro"]
{% endhighlight %}
