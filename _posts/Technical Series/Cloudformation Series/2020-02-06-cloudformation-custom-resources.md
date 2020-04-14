---
layout: post
title: Custom Resources
date: 2020-02-02 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: A means to define non-cloudformation standard resources
tags: [cloudformation, custom, resources, nodejs]
prevPost:
  text: "Resources"
  link: "/technical-series/cloudformation-series/cloudformation-resources"
nextPost:
  text: "Macros"
  link: "/technical-series/cloudformation-series/cloudformation-macros"
docs:
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html\">AWS docs on custom resources</a>"
skill: proficient
tips:
  - "<a href = \"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-lambda-function-code-cfnresponsemodule.html\"> Is a great tool for sending the responses back to cloudformation (as the examples will show)"
---

Custom Resources are a way to define non-cloudformation standard resource definitions.

For example - At the time of writing this cloudformation did not have support for enabling shieldAdvanced subscriptions in your account. The below are the required pieces to achieve it via custom resources

##### CustomResource Javascript

```javascript
  // include the main SDK
var AWS = require("aws-sdk");

  // as mentioned in the tip above
var CFN_RESPONSE = require("cfn-response");

  // create an AWS Shield Constructor
var SHIELD = new AWS.Shield();
  
  // as shield advanced runs out of us-east-1
AWS.config.region = "us-east-1";
  
  // handler function for cloudformation create/updates
var shieldEnable = function(params) {    
     return new Promise(
        function (resolve, reject) {
            SHIELD.createSubscription({
              // no params required
            }, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        }
    )
}

  // handler function for cloudformation deletes
var shieldDisable = function(params) {    
     return new Promise(
        function (resolve, reject) {
            SHIELD.deleteSubscription({
              // no params required
            }, function(err, data) {                
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
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
  
              // switch for each cloudformation event type
            switch(event.RequestType) {
                case "Create": {
                    return shieldEnable(event);
                }
                case "Update": {
                    return shieldEnable(event);
                }
                case "Delete": {
                    return shieldDisable(event);
                }
            }
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
              
              // if subscription exists, return success
            if(err.code == "LockedSubscriptionException" ||
                err.code == "ResourceAlreadyExistsException") {
                    CFN_RESPONSE.send(
                      event,
                      context,
                      CFN_RESPONSE.SUCCESS,
                      err
                    );
                    callback(null, cfn_response);
                
              // else return the error to cloudformatioh
            } else {
                CFN_RESPONSE.send(
                  event,
                  context,
                  CFN_RESPONSE.FAILED,
                  err
                );
                callback(err, err.message);
            }
        });
}
```
```json

```
```yml

```
