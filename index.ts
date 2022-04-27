import * as core from '@actions/core';
import utils from "./utils";

const apiKey =  core.getInput('apikey');
const passCode =  core.getInput('passcode');
const project =  core.getInput('project');
const environment =  core.getInput('environment');

let inputs = {
    apiKey,
    passCode,
    project,
    environment
}

for (let item in Object.keys(inputs)){
    if (inputs[Object.keys(inputs)[item]] == ""){
        core.setFailed(Object.keys(inputs)[item] + " is required but not set")
    }
    core.debug(inputs[Object.keys(inputs)[item]])
    console.log(inputs[Object.keys(inputs)[item]]);
    
}

utils.fetchSecrets(apiKey, project, environment).then(secrets => {
    for (let projectIndex in secrets["data"]["generalPublicProjects"]["list"]) {
        let p = secrets["data"]["generalPublicProjects"]["list"][projectIndex]
        if (p["title"] == project) {
            for (let environIndex in p["publicEnvironments"]["list"]) {
                let e = p["publicEnvironments"]["list"][environIndex]
                if (e["title"] == environment) {
                    for (const i in JSON.parse(e["key"])) {
                        utils.aesDecryptSecret(JSON.parse(e["key"])[i], passCode).then(
                            decoded => {
                                decoded = JSON.parse(decoded)
                                let key = decoded["key"]
                                let value = decoded["value"]
                                core.setOutput(key, value)
                            }
                        ).catch(
                            err => {
                                core.setFailed(err.message)
                            }
                        )
                    }
                }
            }
        }
    }
}).catch(err => {
    core.setFailed("Unable to fetch secrets: " + err.message)})



