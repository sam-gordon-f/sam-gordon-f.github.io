---
layout: post
title: "Concepts"
date: 2020-02-01 08:44:38
category: [technical-series, lambda-series]
author: samGordon
short-description: Lambda Concepts
tags: [lambda, concepts]
prevPost:
  text: "Intro"
  link: "/technical-series/lambda-series/lambda-intro"
nextPost:
  text: "Runtimes"
  link: "/technical-series/lambda-series/lambda-runtimes"
skill: beginner
docs:
  - "<a href = \">https://docs.aws.amazon.com/lambda/latest/dg/welcome.html\">AWS docs on 'what is'</a>"
---

The Major components are fairly straight forward, and they follow the basics / image below

1. [Basics](#actions)
2. [Diagram](#diagram)

---

<a name = "basics"></a>
1) Packages are written / uploaded to a virtual construct called a `function`

2) These `functions` are assigned a variety of properties
  
  > a. Runtime<br>
  > b. Timeouts<br>
  > c. Memory<br>
  > d. Role to assume<br>

3) Additional items such as the below can be added
  
  > a. VPC to operate in
  > b. Tracing (Xray integration)
  > c. Triggers (and permissions)

---

<a name = "diagram"></a>

<a href="{{ site.baseurl }}/assets/images/technical-series/lambda/concepts.svg" data-fancybox data-caption="lambda-concepts">
	<img src="{{ site.baseurl }}/assets/images/technical-series/lambda/concepts.svg" alt="drawing" style="width:100%;"/>
</a>
