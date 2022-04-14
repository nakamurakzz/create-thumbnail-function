# create-thumbnail-function
# Serverless - AWS Node.js Typescript

## Installation/deployment instructions
### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

### Locally
```
cp eventTestData.json.sample eventTestData.json
node ./node_modules/serverless/bin/serverless invoke local  --function index --path eventTestData.json --profile xxxx
```
