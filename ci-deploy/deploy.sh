language: node_js
node_js:
- '7'
before_script:
- pwd
- cd templates; npm install
script:
- npm run build
