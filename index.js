"use strict";
exports.__esModule = true;
var core = require("@actions/core");
var utils_1 = require("./utils");
var apiKey = core.getInput('apikey');
var passCode = core.getInput('passcode');
var project = core.getInput('project');
var environment = core.getInput('environment');
var inputs = {
    apiKey: apiKey,
    passCode: passCode,
    project: project,
    environment: environment
};
// for (let item in Object.keys(inputs)){
//     if (inputs[Object.keys(inputs)[item]] == ""){
//         core.setFailed(Object.keys(inputs)[item] + " is required but not set")
//     }
//     core.debug(inputs[Object.keys(inputs)[item]])
//     console.log(inputs[Object.keys(inputs)[item]]);
// }
utils_1["default"].fetchSecrets(apiKey, project, environment).then(function (secrets) {
    for (var projectIndex in secrets["data"]["generalPublicProjects"]["list"]) {
        var p = secrets["data"]["generalPublicProjects"]["list"][projectIndex];
        if (p["title"] == project) {
            for (var environIndex in p["publicEnvironments"]["list"]) {
                var e = p["publicEnvironments"]["list"][environIndex];
                if (e["title"] == environment) {
                    for (var i in JSON.parse(e["key"])) {
                        utils_1["default"].aesDecryptSecret(JSON.parse(e["key"])[i], passCode).then(function (decoded) {
                            decoded = JSON.parse(decoded);
                            var key = decoded["key"];
                            var value = decoded["value"];
                            core.setOutput(key, value);
                        })["catch"](function (err) {
                            core.setFailed(err.message);
                        });
                    }
                }
            }
        }
    }
})["catch"](function (err) {
    core.setFailed("Unable to fetch secrets: " + err.message);
});
