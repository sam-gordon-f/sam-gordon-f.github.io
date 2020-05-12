---
layout: post
title: "Runtimes"
date: 2020-03-03 08:44:38
category: [technical-series, lambda-series]
author: samGordon
short-description: information on available lamnda runtimes
tags: [lambda, runtime]
skill: beginner
---

##### Different native supported runtimes (version inspecific)
1. [NodeJS](#nodejs)
  a. example
  b. build instructions
2. [Python](#python)
  a. example
  b. build instructions
3. Go
  a. [Code](#go-code)
  b. [Build instructions](#go-build)

##### NodeJS

##### Python

##### Go

<a name = "go-code"></a>
Code

```go
package main

import (
  "fmt"
  "context"
  "github.com/aws/aws-lambda-go/lambda"
)

type MyEvent struct {
  Name string `json:"name"`
}

func Handler(ctx context.Context, name MyEvent) (string, error) {
  return fmt.Sprintf("Hello %s!", name.Name ), nil
}

func main() {
  lambda.Start(Handler)
}
```

<br>

<a name = "go-build"></a>
Code

```sh
go get github.com/aws/aws-lambda-go/lambda
GOOS=linux go build main.go
zip function.zip main
```
