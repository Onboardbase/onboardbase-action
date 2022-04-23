const core = require('@actions/core');
const utils = require("./utils");

const apiKey = core.getInput('apikey');
const passCode = core.getInput('passcode');
const project = core.getInput('project');
const environment = core.getInput('environment');

let secrets = utils.fetchSecrets(apiKey, project, environment)

let decoded = utils.aesDecryptSecret(secrets, passCode)
console.log(decoded);
core.setOutput("secrets", decoded)