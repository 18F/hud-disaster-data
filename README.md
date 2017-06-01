[![Build Status Staging](https://img.shields.io/travis/flexion/hud-disaster-data/master.svg?label=build-staging)](https://travis-ci.org/flexion/hud-disaster-data)
[![Build Status Prod](https://img.shields.io/travis/18F/hud-disaster-data/master.svg?label=build-prod)](https://travis-ci.org/18F/hud-disaster-data)

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
Install [node](https://nodejs.org/en/) (the stable version)

Install [git](https://git-scm.com/)

#### Clone this repository

- Using the Flexion repository
  - Run `git clone https://github.com/flexion/hud-disaster-data`
- Using the 18F repository
  - Run `git clone https://github.com/18F/hud-disaster-data`

#### Navigate to cloned directory

`cd hud-disaster-data`

#### Install dependencies
Run `npm install`

#### Development server

Run `npm run dev` for a dev server. It should automatically bring up a browser pointing to `http://localhost:8080/`. The app will automatically reload if you change any of the source files.

#### Ad Hoc Testing

Run `npm test` to run the full test suite.

#### Build

Run `npm build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Build, Test, and Deploy
This project includes a [.travis.yml](.travis.yml) file that will facilitate the building, testing, and deploying of the application, following this structure.

| Repo                      | Branch updated | Build deployed to                   | URL
|:--------------------------|:---------------|:------------------------------------|:------------------------------|
| flexion/hud-disaster-data | sprint-*       | cloud.gov hud-disaster-data dev     |https://hud-disaster-data-dev.app.cloud.gov/#/ |
| flexion/hud-disaster-data | master         | cloud.gov hud-disaster-data staging |https://hud-disaster-data-staging.app.cloud.gov/#/ |
| 18F/hud-disaster-data     | master         | cloud.gov hud-disaster-data prod    | TBD  |

#### Initiation of TravisCI
To include a repo into TravisCI, you must be an admin of that repo.
- Go to [TravisCI](http://travis-ci.org)
- Click **Sign in with GitHub** and sign in
 - *For additional information, see [these directions](https://docs.travis-ci.com/user/getting-started/)*
- Once you’re signed in, and Travis has synchronized your repositories from GitHub, go to your profile page and enable Travis CI for the repository you want to build
  - We already have the [.travis.yml](.travis.yml) in your project, so the first update to the branch will trigger the build and deploy.
- Check the build status page to see if your build passes or fails
