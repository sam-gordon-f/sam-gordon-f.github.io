---
layout: post
title: "Concepts"
date: 2020-02-01 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Overview of Cloudformation Concepts
tags: [cloudformation, concepts]
---

<div class="card official-docs">
  <div class="card-body">
    <a href = "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-whatis-concepts.html">AWS docs</a>
  </div>
</div>

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

<div class="container grid-xl">
  <div class="columns">
    <div class = "column col-3 col-md-4 col-sm-12 col-xs-12">
      <a style="height: auto; width:100%;" class="btn btn-success btn-lg btn-outline py-2 mt-4" href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-intro">Intro</a>
    </div>
    <div class = "column col-6 col-md-4 col-sm-12 col-xs-12">
      
    </div>
    <div class="column col-3 col-md-4 col-sm-12 col-xs-12">
      <a style="height: auto; width:100%;" class="btn btn-success btn-lg btn-outline py-2 mt-4" href = "{{ site.baseurl }}/technical-series/cloudformation-series/cloudformation-template-anatomy">Template Anatomy</a>
    </div>
  </div>
</div>
 
