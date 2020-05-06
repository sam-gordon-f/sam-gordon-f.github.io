---
layout: post
title: "Service Catalog"
date: 2020-02-28 08:44:38
category: [technical-series, cloudformation-series]
author: samGordon
short-description: Host your templates via an App-like store
tags: [cloudformation, parameters, json, service-catalog]
skill: intermediate
---

In accordance with the reusability benefit of templating your infrastructure, AWS released a catalog for hosting your templates across either a single, or fleet of AWS accounts.

Below is some definition around how to achieve an almost 'app' store experience for users inside your environments

##### Service Catalog Concepts
1. [Definining products](#products)
2. [Definining portfolios](#portfolios)
3. [Assigning products / portfolios](#products-portfolios)
4. [Sharing / Permissions](#sharing-permissions)
  a. [Create a portfolio share](#sharing-permissions-a)
  b. [Accept a portfolio share](#sharing-permissions-b)
  c. [Assign an IAM principal](#sharing-permissions-c)
5. [Deploying products](#deployments)

---

<a name = "products"></a>
##### 1) Products

Are essentially cloudformation templates with some additional meta information to make them easily discoverable by users. This can be done via a number of different ways.

Below is an example of creating a product definition via a stack.

```json
{
  "Resources": {
    "serviceCatalogCloudFormationProduct": {
      "Type": "AWS::ServiceCatalog::CloudFormationProduct",
      "Properties": {
        "Owner": "TeamA",
        "SupportDescription": "Please check repo for instructions",
        "Distributor": "CompanyA",
        "SupportEmail": "teamA@companyA.com.au",
        "AcceptLanguage": "en",
        "Name": "superAwesomeProductName",
        "Description": "Here is a sample product description",
        "SupportUrl": "https://github.com/sam-gordon-f/sam-gordon-f.github.io/",
        "ProvisioningArtifactParameters": [
          {
            "Description": "initial version",
            "Info": {
              "LoadTemplateFromURL": "https://s3.amazonaws.com/bucketName/bucketKey/1.0.0/product.template"
            },
            "Name": "1.0.0"
          }, {
            "Description": "major bugfix on defining bucket naming conventions",
            "Info": {
              "LoadTemplateFromURL": "https://s3.amazonaws.com/bucketName/bucketKey/1.1.0/product.template"
            },
            "Name": "1.1.0"
          }
        ]
      }
    }
  }
}
```

<br>

<a name = "portfolios"></a>
##### 2) Porfolios

Are a way to group or organise your products into logical collections (genres, usage, authors, use-case, etc...)

Below is an example of creating a product definition via a stack.

```json
{
  "Resources": {
    "serviceCatalogPortfolio": {
      "Type": "AWS::ServiceCatalog::Portfolio",
      "Properties": {
        "ProviderName": "teamA",
        "Description": "Collection of products to address responsibilityA",
        "DisplayName": "portfolioName",
        "AcceptLanguage": "en"
      }
    }
  }
}
```

<br>

<a name = "products-portfolios"></a>
##### 3) Assigning products / portfolios

So now that we have a product and a portfolio, we need to create the relationship between the two.

```json
{
  "Resources": {
    "serviceCatalogPortfolioProductAssociation": {
      "Type": "AWS::ServiceCatalog::PortfolioProductAssociation",
      "Properties": {
        "AcceptLanguage": "en",
        "PortfolioId": {
          "Ref": "serviceCatalogPortfolio"
        },
        "ProductId": {
          "Ref": "serviceCatalogCloudFormationProduct"
        }
      }
    }
  }
}
```

<br>

<a name = "sharing"></a>
##### 4) Sharing / Permissions

Its time to define who, and where we can deploy the product. There are 3 sections below that make this up

<a name = "sharing-permissions-a"></a>
##### 4a) Creating Shares

<div class="card tip">
  <div class="card-body">
    Cloudformation doesnt currently support OU id sharing (groups of accounts).
    But this is something thats on the roadmap, and will allow you to streamline this process (can be done via custom resources)
  </div>
</div>

```json
{
  "Resources": {
    "serviceCatalogPortfolioShare": {
      "Type" : "AWS::ServiceCatalog::PortfolioShare",
      "Properties" : {
          "AcceptLanguage" : "en",
          "AccountId" : "<<accountId>>",
          "PortfolioId" : "<<portfolioId>>"
        }
    }
  }
}
```

<a name = "sharing-permissions-b"></a>
##### 4a) Accepting Shares

Its necessary to accept the handshake made from the previous step
```json
{
  "Resources": {
    "serviceCatalogPortfolioShare": {
      "Type" : "AWS::ServiceCatalog::AcceptedPortfolioShare",
      "Properties" : {
        "AcceptLanguage" : "en",
        "PortfolioId" : "<<portfolioId>>"
      }
    }
  }
}
```

<a name = "sharing-permissions-c"></a>
##### 4c) Assigning Permissions

<div class="card tip">
  <div class="card-body">
    This step is super important, as by default nobody can deploy a product (this includes account administrators), and its easily overlooked
  </div>
</div>

```json
{
  "Resources": {
    "serviceCatalogPortfolioPrincipalAssociation": {
      "Type" : "AWS::ServiceCatalog::PortfolioPrincipalAssociation",
      "Properties" : {
        "AcceptLanguage" : "en",
        "PortfolioId" : "<<portfolioId>>",
        "PrincipalARN" : "<<principalToGrantAccessTo>>",
        "PrincipalType" : "IAM"
      }
    }
  }
}
```

<br>

<a name = "deployments"></a>
##### 5) Deployments

Products can be deployed via the console, API's or cloudformation (see below). This allows for a self service experience that can be customised, and integrated with pipelines, workflows, and business processes

<div class="card tip">
  <div class="card-body">
    One great feature is the ability to provision via stacksets - This allows for a simple and easy way to create product bundles to deploy across fleets of accounts
  </div>
</div>

```json
{
  "Resources": {
    "serviceCatalogCloudFormationProvisionedProduct": {
      "Type": "AWS::ServiceCatalog::CloudFormationProvisionedProduct",
      "Properties": {
        "ProvisioningArtifactName": "1.1.0",
        "AcceptLanguage": "en",
        "ProductName": "superAwesomeProductName",
        "ProvisionedProductName": "superAwesomeProductName-A"
      }
    }
  }
}
```
