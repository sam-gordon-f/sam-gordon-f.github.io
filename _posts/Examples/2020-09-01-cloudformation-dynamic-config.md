---
layout: post
title: Examples - Dynamic Config Store
date: 2020-09-01 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: create / reference a custom config store in your cloudformation templates / stacks
tags: [cloudformation, lambda, macro, config]
skill: expert
---

The below example creates a custom resource that can be used for interrogating information from within your stacks.
Its made up of two main components

1. [Lambda code (nodejs) - Advertises the config](#javascript)
2. [Template1 - template that creates / references the custom config](#template1)

---

<a name = "javascript"></a>
##### Lambda code - nodejs (Advertises the custom config)

The below is a javascript (nodeJS) function that looks up details (from a source of your choosing), and then returns a key map to Cloudformation

```javascript
// include the main SDK
var AWS = require("aws-sdk");

// as mentioned in the tip above
var CFN_RESPONSE = require("cfn-response");

/*
 * This function is where the magic happens. You could
 *  > Get details from dynamodb
 *  > Get details from RDS
 *  > Read from an S3 File
 *  > Have a heira map
 */
var generateConfig = function(params) {    
   return new Promise(
      function (resolve, reject) {
          resolve({
              first: "testValue1",
              second: "testValue2",
              third: "testValue3"
          });        
      }
  )
}

// handler function for validating params passed *optional
// I tend to use this as a wrapper for all my custom resource code
var validateParams = function(params) {
  return new Promise(
      function (resolve, reject) {
          resolve({
              status: true
          });
      }
  );
}

exports.handler = (event, context, callback) => {    
    
    // check the params passed before executing anything
  validateParams(event).
      then(function(resp) {
              /*
               *  as we dont need to create / update / delete anything.
               *  the function ignores the requestType
               */
          return generateConfig(event);
      }).
        // if successful
      then(function(resp) {            
          CFN_RESPONSE.send(
            event,
            context,
            CFN_RESPONSE.SUCCESS,
            resp
          );
          callback(null, resp);
      }).
        // if exception
      catch(function(err) {
          CFN_RESPONSE.send(
            event,
            context,
            CFN_RESPONSE.FAILED,
            err
          );
          callback(err, err.message);
      });
}
```

---

<a name = "template1"></a>
##### template1 (template that creates / references the custom config)

The below creates a custom Resource that is populated with key values as attributes from the above lambda.
In the outputs for the template, you can see that they expose these three `test` values to demonstrate how to reference

```json
{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description": "A description to help identify the purpose of the template",
  "Resources": {
    "customConfig": {
      "Type": "Custom::Config",
      "Properties": {
        "Version": "1.0",
        "ServiceToken": "<<ArnOfTheAboveFunction>>"
      }
    }
  },
  "Outputs": {
    "customConfigFirst": {
      "Value": {
        "Fn::GetAtt": [
          "customConfig",
          "first"
        ]
      },
      "Name": "customConfigFirst"
    },
    "customConfigSecond": {
      "Value": {
        "Fn::GetAtt": [
          "customConfig",
          "second"
        ]
      },
      "Name": "customConfigSecond"
    },
    "customConfigThird": {
      "Value": {
        "Fn::GetAtt": [
          "customConfig",
          "third"
        ]
      },
      "Name": "customConfigThird"
    }
  }
}
```
```yml
---
AWSTemplateFormatVersion: '2010-09-09'
Description: A description to help identify the purpose of the template
Resources:
  customConfig:
    Type: Custom::Config
    Properties:
      Version: '1.0'
      ServiceToken: <<ArnOfTheAboveFunction>>
Outputs:
  customConfigFirst:
    Value: !GetAtt 'customConfig.first'
    Name: customConfigFirst
  customConfigSecond:
    Value: !GetAtt 'customConfig.second'
    Name: customConfigSecond
  customConfigThird:
    Value: !GetAtt 'customConfig.third'
    Name: customConfigThird
```
