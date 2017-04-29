# Cloud.gov extra setup steps

## Creating a service account
  - using staging as our example, issue this command at a prompt
    - `cf create-service cloud-gov-service-account space-deployer staging-deploy-sa`
    - you will see something like this:
```
Creating service instance staging-deploy-sa in org hud-disaster-data / space dev as yourname@yourdomain.com...
OK
```
  - then issue this: cf service staging-deploy-sa
    - you will see something like this:
```
Service instance: staging-deploy-sa
Service: cloud-gov-service-account
Bound apps:
Tags:
Plan: space-deployer
Description: Manage cloud.gov service accounts with access to your organization
Documentation url:
Dashboard: https://fugacious.18f.gov/m/awS6UkWJ0OdWq7RqyPhG9NnflDMhsA1Zz

Last Operation
Status: create succeeded
Message:
Started: 2017-04-27T13:40:19Z
Updated: 2017-04-27T13:40:19Z
```
  - go to the URL they present, to get your credentials (ex: https://fugacious.18f.gov/m/awS6UkWJ0OdWq7RqyPhG9NnflDMhsA1Zz)
  - we created environmental variables in TravisCI that were passed into the deploy script containing the username and password
  - you will need to repeat the above steps for other spaces (ex: dev, prod)

## Adding a space user for manual deploy (using staging space as example)
  - at a command prompt, issue this command: cf set-space-role somename@somedomain.com hud-disaster-data staging SpaceDeveloper
  - **NOTE: we were told when new environments were setup, it might take a little while before you can run the above command, due to the cloud-gov-service-account service not being available yet.**
