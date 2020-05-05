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

##### Typical Lifecycle

1. [Anaylse Scenario](#analyse)
2. [Create / Upload](#create-upload)
3. [Test / Tweak](#test-tweak)

[Diagram of concepts](#diagram)

---

<a name = "analyse"></a>
##### Analyse

So this is a step that seems to be missed more and more as Serverless functions have gained popularity.
While lambda is a fantastic, cheap, and easy solution; Its not always the best fit ffor all problems.
(If the below boxes are checked, its probably a good choice however)

<input type = "checkbox" id = "check1" name = "check1"> <label for = "check1">Your solution can be stateless</label>
<input type = "checkbox" id = "check2" name = "check2"> <label for = "check1">Your solution is event driven</label>
<input type = "checkbox" id = "check3" name = "check3"> <label for = "check1">Your solution can be written in the supported runtimes</label> *
<input type = "checkbox" id = "check3" name = "check3"> <label for = "check1">Your solution doesnt need to run in a network</label> **

<div class="card tip">
  <div class="card-body">
    * While lambda supports custom runtimes; its much easier, and performs better if you stick to the native list
      <br>
    ** While lambda can definitely run inside a VPC (and fairly well !), it introduces a number of questions about your environments (available IP's, etc...)
  </div>
</div>

---

<a name = "create-upload"></a>
##### Create

You'll need to either edit inside the console, or create some automation to create a deployment packages. Once done, you'll need to assign the following properties
  
  > a. `Runtime`, the chosen language your code is to be written in<br>
  > b. `Timeout`, the desired maximum time you want the code running (has restrictions)<br>
  > c. `Memory`, the desired amount of memory to allocated to each running invocation<br>
  > d. `Role`, the desired role (and permissions) that you want your function to be able to execute<br>

Additional items such as the below can be added
  
  > a. `VPC`, to run your function next to your private resources such as RDS instances<br>
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

---

<a name = "test-tweak"></a>
##### Test / Tweak

Once the above is done, you'll need to review performance and tweak as you observe the behaviour. This can be done using a variety of tools that we'll discuss later
<br>

---

<a name = "diagram"></a>
The below shows the relationship between the major resources that come together to make a lambda function work

<a href="{{ site.baseurl }}/assets/images/technical-series/lambda/concepts.svg" data-fancybox data-caption="lambda-concepts">
	<img src="{{ site.baseurl }}/assets/images/technical-series/lambda/concepts.svg" alt="drawing" style="width:100%;"/>
</a>
