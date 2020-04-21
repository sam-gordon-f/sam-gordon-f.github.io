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
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-whatis-concepts.html\">AWS docs on cloudformation key concepts</a>"
skill: beginner
---

The Major concepts are fairly straight forward, and they follow the model / actions below

1) Cloudformation templates are written to describe infrastructure in the desired state. These can be written in JSON / YML, or any number of DSL's ( `official and otherwise` )
  
2) These templates are then fed to cloudformation with the `createStack` directive
  
3) The service will attempt to create a stack containing the resource(s) aforementioned
  
4) Moving forwards, the following `operations` can be undertaken
  
---

  a. `deleteStack`, which will attempt to remove all resources
    
  b. `updateStack`, which will take an updated template and attempt to update all resources to match the new changes
  
  c. `createChangeSet`, which will attempt to create a list of changes that would occur if an update was executed
  
  d. `executeChangeSet`, which will attempt to update the stack, much like the `updateStack` operation

---

5) If an issue occurs with any of the above steps. The service will attempt to revert to the `previous known state`. This is why the service is so powerful !

<a href="{{ site.baseurl }}/assets/images/technical-series/cloudformation/concepts.svg" data-fancybox data-caption="cloudformation-concepts">
	<img src="{{ site.baseurl }}/assets/images/technical-series/cloudformation/concepts.svg" alt="drawing" style="width:100%;"/>
</a>
