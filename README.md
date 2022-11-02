
# Onboardbase Github Action

This action retrieves secrets from onboardbase for use in a Github Action Workflow

## Inputs

## `apikey`

**Required** Your Onboardbase API key.

## `passcode`

**Required** The passcode for the API key.

## `project`

**Required** The project to fetch secrets from.

## `environment`

**Required** The environment to fetch secrets from.

<!-- ## Outputs

## `time`

The time we greeted you. -->

## Example usage

---
```yaml

- name: Fetch secrets
    id: fetch-secrets
    uses: Onboardbase/onboardbase-action@v6.0.8
    with:
        apikey: ${{secrets.ONBOARDBASE_APIKEY}}
        passcode: ${{secrets.ONBOARDBASE_PASSCODE}}
        project: ${{secrets.ONBOARDBASE_PROJECT}}
        environment: ${{secrets.ONBOARDBASE_ENVIRONMENT}}
        json-key: YOUR_UNIQUE_JSON_KEY

- name: Use secrets
    run: "echo 'The secret value is: ${{ steps.fetch-secrets.outputs.<SECRET_KEY> }}'"
```
---
