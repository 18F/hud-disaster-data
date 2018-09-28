[![TODO board](https://imdone.io/api/1.0/projects/59ee0cabe09cf806173a9ee3/badge)](https://imdone.io/app#/board/flexion/hud-disaster-data)

[![Build Status Flexion master](https://api.travis-ci.org/flexion/hud-disaster-data.svg?branch=master)](https://travis-ci.org/flexion/hud-disaster-data)
# HUD Disaster Data Pilot

A pilot of a website that collects and displays disaster data for use by Community Development Block Grant-Disaster Recovery (CDBG-DR) grantees.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for additional information.

## Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.

## Setup
### Local environment
#### Dependencies
Install [node](https://nodejs.org/en/) (You should get a 6.10.x version)

Install [git](https://git-scm.com/)

#### Clone this repository

- Using the Flexion repository
  - Run `git clone https://github.com/flexion/hud-disaster-data`
- Using the 18F repository
  - Run `git clone https://github.com/18F/hud-disaster-data`

#### Navigate to cloned directory's app subdirectory

`cd hud-disaster-data/app/`

#### Install dependencies
Run `npm install`

#### Development server

Run `npm run dev` for a dev server. It should automatically bring up a browser pointing to `http://localhost:8080/`. The app will automatically reload if you change any of the source files.

#### Ad Hoc Testing

Run `npm test` to run the full test suite.

#### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

#### Structure of this project

We started with the scaffolding from vue-cli, and modified it to fit our needs.  Much of the complicated devops structure is from this scaffolding.  Read more about [the scaffolding](./VUE_CLI_INIT.md)

### Build, Test, and Deploy
This project includes a [.travis.yml](.travis.yml) file that will facilitate the building, testing, and deploying of the application, following this structure:

| Repo                      | Branch updated | Build deployed to                   | URL
|:--------------------------|:---------------|:------------------------------------|:------------------------------|
| flexion/hud-disaster-data | sprint-*       | nowhere      |none |
| flexion/hud-disaster-data | master         | nowhere  |none |
| 18F/hud-disaster-data     | master         | nowhere    | TBD  |
| http://gitlab/hhq/hud.dev/DRDP  | develop         |  dev    | https://hudappsint.hud.gov/femadataDev   |
| http://gitlab/hhq/hud.dev/DRDP  | master         |  test    | https://hudappsint.hud.gov/femadataTest   |


#### Config for application
##### (app root directory)/env.json
The contents of this file should be:
```
{
  "COOKIE_SECRET": "secret!@#",
  "HUD_API_BASE_URL": "https://esbapi-dev.hhq.hud.dev/hud-esb",    // URL for ESB Mule services for this environment
  "HUD_OPENAM_BASE_URL": "https://esboam-dev.hhq.hud.dev/openam",  // URL for OAuth for this environment
  "oamUserId": "XIDSetForThisEnvironment",
  "oamPassword": "PasswordSetForThisEnvironment",
  "DRDPOAuth2Scope": "urn:hud:esb:api:fema:get:disaster",
  "DRGROAuth2Scope": "urn:hud:esb:api:drgr:get:user:authorization",
  "oAuth2ClientId": "DrdpOAuth2Client"
}
```

For more information about the deploy piece read [CG_DEPLOY](./CG_DEPLOY.md)

#### Initiation of TravisCI
To include a repo into TravisCI, you must be an admin of that repo.
- Go to [TravisCI](http://travis-ci.org)
- Click **Sign in with GitHub** and sign in
 - *For additional information, see [these directions](https://docs.travis-ci.com/user/getting-started/)*
- Once you’re signed in, and Travis has synchronized your repositories from GitHub, go to your profile page and enable Travis CI for the repository you want to build
  - We already have the [.travis.yml](.travis.yml) in your project, so the first update to the branch will trigger the build and deploy.
- Check the build status page to see if your build passes or fails
- Try the URL for cloud.gov to see the site
