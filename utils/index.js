const  CryptoJS  = require('crypto-js');
const axios = require('axios');
const core = require('@actions/core');

const instance = axios.create({
    baseURL: 'https://api.onboardbase.com/graphql',
  });

const decryptSecrets = (
    secrets,
    passcode
  ) => {
    const encryptionPassphrase = passcode;
    try {
      const bytes = CryptoJS.AES.decrypt(secrets, encryptionPassphrase);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      core.setFailed(error.message)
    }
  };

export const aesDecryptSecret = (secret, passcode) => {
    return decryptSecrets(secret, passcode);
  };

  
  
  export const fetchSecrets = async (api_key, project, environment) => {
    instance.defaults.headers['KEY'] = api_key;
  
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
  
    const { data } = await instance.post('', { query });
  
    if (data.errors && data.errors[0].message === 'Unauthorized')
    core.setFailed("Unable to fetch secrets. You may not be authorized please check your API key")
  
    return data;
  };
  