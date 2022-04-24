# Onboardbase Github Action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

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

```yaml

- name: Fetch secrets
    id: fetch-secrets
    uses: Onboardbase/onboardbase-action@v0.0.8
    with:
        apikey: ${{secrets.APIKEY}}
        passcode: ${{secrets.PASSCODE}}
        project: ${{secrets.PROJECT}}
        environment: ${{secrets.ENVIRONMENT}}

- name: Use secrets
    run: "echo 'The secret value is: ${{ steps.fetch-secrets.outputs.SECRET }}'"
```
