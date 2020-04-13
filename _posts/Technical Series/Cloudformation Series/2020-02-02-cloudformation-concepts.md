---
layout: post
title: "Concepts"
date: 2020-02-01 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Overview of Cloudformation Concepts
tags: [cloudformation, concepts]
prevPost:
  text: "Intro"
  link: "/technical-series/cloudformation-series/cloudformation-intro"
nextPost:
  text: "Template Anatomy"
  link: "/technical-series/cloudformation-series/cloudformation-template-anatomy"
docs:
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-whatis-concepts.html\">AWS docs</a>"
---
The Major concepts are fairly straight forward

1) Cloudformation templates are written to describe infrastructure in the desired state
  <br>
2) These templates are then fed to cloudformation with the `createStack` directive
  <br>
3) The service will attempt to create a stack containing the resource aforementioned
  <br>
4) Moving forwards, the following operations can be undertaken
  <br>
- deleteStack, which will attempt to remove all resources
  <br>
- updateStack, which will take an updated template and attempt to update all resources to match the new changes
  <br>
- createChangeSet, which will attempt to create a list of changes that would occur if an update was executed
  <br>
- executeChangeSet, which will attempt to update the stack, much like the `updateStack` operation

<img src="{{ site.baseurl }}/assets/images/technical-series/cloudformation/concepts1.png" alt="drawing" style="width:100%;"/>

 
