---
layout: post
title: Cloudformation VPC (Fn::Cidr)
date: 2020-09-03 08:44:38
category: [examples]
author: samGordon
short-description: create a full working VPC "only with cloudformation"
tags: [cloudformation, vpc]
skill: expert
---

The below example creates codepipeline that
  - triggers on S3 (other examples show codecommit) <br>
  - validates some cloudformation in the deployment (using cfn-lint) <br>
  - creates a changeset <br>
  - asks for confirmation <br>
  - executes the changeset <br>

1. [Cloudformation template](#template)

---

<a name = "template"></a>
##### 1) Cloudformation template

```json

```
