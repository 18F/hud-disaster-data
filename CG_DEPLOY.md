# Cloud.gov extra setup steps

## Adding a space user (using staging space as example)
  - at a command prompt, issue this command: `cf set-space-role somename@somedomain.com hud-disaster-data staging SpaceDeveloper`
  - **NOTE: we were told when new environments were setup, it might take a little while before you can run the above command, due to the cloud-gov-service-account service not being available yet.**

## Creating a service account
  - make sure you have SpaceDeveloper access (see above)
  - using staging as our example, issue this command at a prompt
    - `cf create-service cloud-gov-service-account space-deployer staging-deploy-sa`
    - you will see something like this:
```
Creating service instance staging-deploy-sa in org hud-disaster-data / space dev as yourname@yourdomain.com...
OK
```
  - then issue this: `cf service staging-deploy-sa`
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
  - using the credentials from above, edit the .travis.yml file, and put the username in the proper section in the username: line
  - generate the encrypted password using the following
    - `travis encrypt 'password from fugacious site above' -r '18F/hud-disaster-data'`
    - replace the secure: line with the output
     - IMPORTANT: make sure to pay attention to whether you need to escape any special characters.  [Read this](https://docs.travis-ci.com/user/encryption-keys#Note-on-escaping-certain-symbols)
  - NOTE: you will need to repeat the above steps for other spaces (ex: dev, prod)


## Example .travis.yml file
```
language: node_js
node_js:
- '7'
before_script:
- pwd
- env
- npm install
script:
- npm run build
deploy:
- manifest: ./cg-deploy/manifests/manifest-dev.yml
  edge: true
  provider: cloudfoundry
  api: https://api.fr.cloud.gov
  username: XxXxXXxXxX-6956-43d4-936e-XxXxXXxXxX48a
  password:
    secure: XxXxXXxXxXXxXxXXxXxXXxXxXXxXxXXxXxXXxXxXXxXxX+zEhKHjOIfNB1AX0bdtvSjl8OUOKG6XLKSkVsNoFeiMCEMR5XHDJP/A/K/u/PPvPuCybIxFMVSvHOowGTGpLiacIa28sQqEVaaVnRV6LIFvER3NbpMwyDCDecOMv7yuDsYKIQTQ3TUEbTcLZ8XVxcFC8jxVPpB0POtWEwqzFKyr9z4PzEPAbGUPj0+5tIyaTB9+fbOEMg3jkC4KZWexLlnQXxXxXXxXxXXxXxXXxXxXXxXxXXxXxXXxXxX8fxxhoH4o6P40fAogXB/pByRFTeetLb1t1e5w6/S9p9Zp9ndCqf1ff8ZKaOSoWpf1n0gm11BdFMB6mf3tA7ZpPjIYxYtGtPmmoGKpbvJkehBC0ZnUGq/bZJU78L9rmwcgzQh7msevapyOn0kjxLJ2wRKlhefl9+lLp76rYqzjaWG3t04umZy+CPbuuMljF6TdFXRkWUIZKwyWoUQgd/WkENwIN0gpv/shp17nt+JDsLxx2GKgSbI+hLx55gwQWISdTmf83Sna3dz1ShrCk8YrHsqrXlDrY0ADe98vKmYWDIGbbb27BBdYlcUDAWavAJIWE64bniaFxmfjiGki5LwNkMcdeOGrEYm060HbXxXxXXxXxXXxXxXXxXxXXxXxXXxXxX=
  organization: hud-disaster-data
  space: dev
  on:
    branch: sprint-*
- manifest: ./cg-deploy/manifests/manifest-staging.yml
  edge: true
  provider: cloudfoundry
  api: https://api.fr.cloud.gov
  username: XxXxXXxXxX-0b24-449a-ab24-XxXxXXxXxXa04
  password:
    secure: XxXxXXxXxXXxXxXXxXxXXxXxXXxXxXXxXxXXxXxXXxXxX/uPDQQTL1ib+TmMX22luOqjiIURxcJGrId+dDlCgg/kQWMROU0uYL5SEzgJnnJTINnlYmapBnmf2W54n1QzCzKYQVO4jH/mm+VYGMEOCnqKwi2gFi/wom0W8ruqiYF0E3fJe33p+xWBL2i0v4XYNKJ5vfVkBMUIcuh/HK46LONvSmmaWyqbJRNv4KqlTYJgXxXxXXxXxXXxXxXXxXxXXxXxXXxXxXXxXxXXxXxXXxXxXxMPsXUXxXxX9///OgQ/phH5UmCmMwaeT5xV97JqKIcM9d3uZVeXHLBjps7f7GgYzSvop4LHiuRLhzC/QAh31cdejn60hAjsTukAxQnu944DacelHXFhUu+WnejgkF97+dioBU8ESMP7n0EJrJS3uvoTt3INAAjItNxGEJ4TuvHYTRzGQMvH4024B6InmKTxs2swXKS9a1HGLAYn1wusd0dhr61nbSEMAxE3lJhUsyUjfg/XwvO4dSO7aO+VkVJMNAgMhf6pS6UyTeYnmLw+eZmpQYHMTfCOMnRwrdyCm/eBmQkZ3RLiaBwCFrxeuqbHt46VOsFdxWsWYlN87YO3oIKpryT6v8abxAD5yT6c8hE8N+igurYGYXxXxXXxXxXXxXxXXxXxXXxXxXXxXxX=
  organization: hud-disaster-data
  space: staging
  on:
    branch: master
```
