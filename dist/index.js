"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const utils_1 = require("./utils");
const apiKey = "Q34JCGFHJ7EYTQBNCJAQQR";
const passCode = "passcode";
const project = "test_project";
const environment = "development";
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
                    for (const i in JSON.parse(e["key"])) {
                        utils_1.default
                            .aesDecryptSecret(JSON.parse(e["key"])[i], passCode)
                            .then((decoded) => {
                            decoded = JSON.parse(decoded);
                            let key = decoded["key"];
                            let value = decoded["value"];
                            core.setOutput(key, value);
                        })
                            .catch((err) => {
                            core.setFailed(err.message);
                        });
                    }
                }
            }
        }
    }
})
    .catch((err) => {
    core.setFailed("Unable to fetch secrets: " + err.message);
});
//# sourceMappingURL=index.js.map