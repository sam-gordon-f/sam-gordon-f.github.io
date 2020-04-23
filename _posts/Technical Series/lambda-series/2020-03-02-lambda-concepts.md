---
layout: post
title: "Concepts"
date: 2020-03-02 08:44:38
category: [technical-series, lambda-series]
author: samGordon
short-description: Lambda Concepts
tags: [lambda, concepts]
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

2) These `functions` are assigned a variety of basic properties
  
  > a. `Runtime`, the chosen language your code is to be written in<br>
  > b. `Timeout`, the desired maximum time you want the code running (has restrictions)<br>
  > c. `Memory`, the desired amount of memory to allocated to each running invocation<br>
  > d. `Role`, the desired role (and permissions) that you want your function to be able to execute<br>

<div class="card tip">
  <div class="card-body">
    Increasing memory allocated doesnt always decrease invocation time; Choosing a relevant language, and understanding the problem / logic thats being run is the best way to tweak
  </div>
</div>
<br>

3) Additional items such as the below can be added
  
  > a. `VPC`, the desired vpc and subnets to create your ENI's in<br>
  > b. `Tracing`, whether or not to create xray traces on invocation <br>
  > c. `Triggers`, which services are going to invoke (each service behaves differently; more later)<br>
  > d. `Concurrency` the desired maximum concurrent invocations of the function<br>
  > d. `Weighting`, Balancing between 2 versions (canary releases)

<div class="card tip">
  <div class="card-body">
    Both VPC and tracing options require your role to have some additional actions specified.<br>
    - For X-ray, you use the managed policy `AWSXRayDaemonWriteAccess` or reverse engineer the actions to add yourself<br>
    - For VPC, you should  use the managed policy `AWSLambdaVPCAccessExecutionRole` or add the following<br>
  </div>
</div>
<br>

---

<a name = "diagram"></a>
<a href="{{ site.baseurl }}/assets/images/technical-series/lambda/concepts.svg" data-fancybox data-caption="lambda-concepts">
	<img src="{{ site.baseurl }}/assets/images/technical-series/lambda/concepts.svg" alt="drawing" style="width:100%;"/>
</a>
