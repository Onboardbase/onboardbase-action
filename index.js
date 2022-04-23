const core = require('@actions/core');
const utils = require("./utils");

const apiKey = core.getInput('apikey');
const passCode = core.getInput('passcode');
const project = core.getInput('project');
const environment = core.getInput('environment');

let secrets = utils.fetchSecrets(apiKey, project, environment)
core.debug(secrets)
core.info(secrets)
let decoded = utils.aesDecryptSecret(secrets, passCode)
console.log(decoded);
core.debug(decoded)
core.info(decoded)

core.setOutput("secrets", decoded)