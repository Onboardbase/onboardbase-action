export declare const aesDecryptSecret: (secret: any, passcode: any) => any;
export declare const fetchSecrets: (api_key: string, project: string, environment: string) => Promise<any>;
declare const _default: {
    aesDecryptSecret: (secret: any, passcode: any) => any;
    fetchSecrets: (api_key: string, project: string, environment: string) => Promise<any>;
};
export default _default;
