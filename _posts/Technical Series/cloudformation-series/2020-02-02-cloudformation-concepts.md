---
layout: post
title: "Concepts"
date: 2020-02-02 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Overview of Cloudformation Concepts
tags: [cloudformation, concepts]
docs:
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-whatis-concepts.html\">AWS docs on cloudformation key concepts</a>"
skill: beginner
---

The Major concepts are fairly straight forward, and they follow the model / actions below

1. [Actions](#actions)
2. [Diagram](#diagram)

---

<a name = "actions"></a>
##### 1) Write Cloudformation templates

These reflect the desired state of your infrastructure, and can be written in JSON / YML, or any number of DSLs (domain specific language)
  
<br>
##### 2) Execute `createStack` action alongside your template

This gives Cloudformation the command to create a stack to house the resources reflected in your template
  
<div class="card tip">
  <div class="card-body">
    You could also use the `createChangeSet` directive to give an indication on what the template will create before running
  </div>
</div>
<br>
  
##### 3) After your stack stabilises

All of your infrastructure will have been created. Moving forwards, the following `operations` can be undertaken

  > a. `deleteStack`, which will attempt to remove all resources<br>
  > b. `updateStack`, which will take an updated template and attempt to update all resources to match the new changes<br>
  > c. `createChangeSet`, which will attempt to create a list of changes that would occur if an update was executed<br>
  > d. `executeChangeSet`, which will attempt to update the stack, much like the `updateStack` operation

<br>
##### 4) If an issue occurs with any of the above steps

The service will attempt to revert to the `previous known state`. This is one of the key reasons why the service is so powerful !

---

The below shows how each template can be instantiated as a stack, and then in turn, those stacks contain resources

<a name = "diagram"></a>
<a href="{{ site.baseurl }}/assets/images/technical-series/cloudformation/concepts.svg" data-fancybox data-caption="cloudformation-concepts">
	<img src="{{ site.baseurl }}/assets/images/technical-series/cloudformation/concepts.svg" alt="drawing" style="width:100%;"/>
</a>
