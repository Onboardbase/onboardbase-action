"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const utils_1 = require("./utils");
const JSON_KEY_DEFAULT = "JSON_VALUE";
const apiKey = core.getInput("apikey");
const passCode = core.getInput("passcode");
const project = core.getInput("project");
const environment = core.getInput("environment");
const jsonKey = core.getInput("json-key") || JSON_KEY_DEFAULT;
let inputs = {
    apiKey,
    passCode,
    project,
    environment,
};
utils_1.default
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
                        let decoded = utils_1.default.aesDecryptSecret(JSON.parse(e["key"])[i], passCode);
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
//# sourceMappingURL=index.js.map