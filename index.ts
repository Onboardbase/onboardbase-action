
import * as core from "@actions/core";
import utils from "./utils";

const JSON_KEY_DEFAULT = "ONBOARDBASE_JSON_DATA"
const apiKey: string = core.getInput("apikey");
const passCode: string = core.getInput("passcode");
const project: string = core.getInput("project");
const environment: string = core.getInput("environment");
const jsonKey: string = core.getInput("json-key") || JSON_KEY_DEFAULT;

let inputs = {
  apiKey,
  passCode,
  project,
  environment,
};

// for (let item in Object.keys(inputs)){
//     if (inputs[Object.keys(inputs)[item]] == ""){
//         core.setFailed(Object.keys(inputs)[item] + " is required but not set")
//     }
//     core.debug(inputs[Object.keys(inputs)[item]])
//     console.log(inputs[Object.keys(inputs)[item]]);

// }
utils
  .fetchSecrets(apiKey, project, environment)
  .then((secrets) => {

    for (let projectIndex in secrets["data"]["generalPublicProjects"]["list"]) {
      let p = secrets["data"]["generalPublicProjects"]["list"][projectIndex];
      if (p["title"] == project) {
        for (let environIndex in p["publicEnvironments"]["list"]) {
          let e = p["publicEnvironments"]["list"][environIndex];
          if (e["title"] == environment) {
            const secretsObj = {};
            for (const i in JSON.parse(e["key"])) {
              let decoded = utils.aesDecryptSecret(JSON.parse(e["key"])[i], passCode)
              decoded = JSON.parse(decoded);
              let key = decoded["key"];
              let value = decoded["value"];
              secretsObj[key] = value;
              core.setOutput(key, value);
              core.setSecret(value);
            }
            core.setOutput(jsonKey, JSON.stringify(secretsObj));
          }
        }
      }
    }
  })
  .catch((err) => {
    core.setFailed("Unable to fetch secrets: " + err.message);
  });