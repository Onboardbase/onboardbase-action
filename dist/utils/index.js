"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSecrets = exports.aesDecryptSecret = void 0;
const CryptoJS = require("crypto-js");
const axios_1 = require("axios");
const core = require("@actions/core");
const instance = axios_1.default.create({
    baseURL: "https://api.onboardbase.com/graphql",
});
const decryptSecrets = (secret, encryptionPassphrase) => {
    try {
        const bytes = CryptoJS.AES.decrypt(secret.toString(), encryptionPassphrase);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
    catch (error) {
        console.log(error);
        core.setFailed("Unable to decrypt secret. Your passcode might be invalid");
    }
};
const aesDecryptSecret = async (secret, passcode) => {
    console.log({ secret, passcode });
    return decryptSecrets(secret, passcode);
};
exports.aesDecryptSecret = aesDecryptSecret;
const fetchSecrets = async (api_key, project, environment) => {
    instance.defaults.headers["KEY"] = api_key;
    console.log(api_key);
    const query = `query {
      generalPublicProjects(filterOptions: { title: "${project}", disableCustomSelect: true }) {
        list {
          id
          title
          publicEnvironments(filterOptions: { title: "${environment}" }) {
            list {
              id
              key
              title
            }
          }
        }
      }
    }`;
    const { data } = await instance.post("", { query });
    if (data.errors && data.errors[0].message === "Unauthorized")
        core.setFailed("Unable to fetch secrets. You may not be authorized please check your API key");
    return data;
};
exports.fetchSecrets = fetchSecrets;
exports.default = { aesDecryptSecret: exports.aesDecryptSecret, fetchSecrets: exports.fetchSecrets };
//# sourceMappingURL=index.js.map