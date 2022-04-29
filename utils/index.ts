import CryptoJS from "crypto-js";
import axios from "axios";
import * as core from "@actions/core";

const instance = axios.create({
  baseURL: "https://api.onboardbase.com/graphql",
});

const decryptSecrets = (secret: string, passcode: string) => {
  const encryptionPassphrase = passcode;
  try {
    const bytes = CryptoJS.AES.decrypt(secret.toString(), encryptionPassphrase);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    core.setFailed("Unable to decrypt secret. Your passcode might be invalid");
  }
};

export const aesDecryptSecret = async (secret, passcode) => {
  return decryptSecrets(secret, passcode);
};

export const fetchSecrets = async (
  api_key: string,
  project: string,
  environment: string
) => {
  instance.defaults.headers["KEY"] = api_key;

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
    core.setFailed(
      "Unable to fetch secrets. You may not be authorized please check your API key"
    );

  return data;
};

export default { aesDecryptSecret, fetchSecrets };
