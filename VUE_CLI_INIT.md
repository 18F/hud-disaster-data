# Getting started with a VUE project via the vue-cli scaffolding

## Install the CLI
  - [vue-cli](https://github.com/vuejs/vue-cli)
  - Follow the directions for installing, i.e.: `npm install -g vue-cli`

## Create a project
  - For example: `vue init webpack my-project`

## Further documentation
  - The vue-cli uses the [vue-webpack-boilerplate](https://github.com/vuejs-templates/webpack) template.  There is good documentation there.
  - [wbpack template](http://vuejs-templates.github.io/webpack/)

## The structure of your project
```
.
├── build/                      # webpack config files
│   └── ...
├── config/
│   ├── index.js                # main project config
│   └── ...
├── src/
│   ├── main.js                 # app entry file
│   ├── App.vue                 # main app component
│   ├── components/             # ui components
│   │   └── ...
│   └── assets/                 # module assets (processed by webpack)
│       └── ...
├── static/                     # pure static assets (directly copied)
├── test/
│   └── unit/                   # unit tests
│   │   ├── specs/              # test spec files
│   │   ├── index.js            # test build entry file
│   │   └── karma.conf.js       # test runner config file
│   └── e2e/                    # e2e tests
│   │   ├── specs/              # test spec files
│   │   ├── custom-assertions/  # custom assertions for e2e tests
│   │   ├── runner.js           # test runner script
│   │   └── nightwatch.conf.js  # test runner config file
├── .babelrc                    # babel config
├── .postcssrc.js               # postcss config
├── .eslintrc.js                # eslint config
├── .editorconfig               # editor config
├── index.html                  # index.html template
└── package.json                # build scripts and dependencies
```
