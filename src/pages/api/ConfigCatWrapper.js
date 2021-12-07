import * as configcat from "configcat-js-ssr";
import LoggerWrapper from "./LoggerWrapper";

let client = null;

const ConfigCatWrapper = {
    createClient(configChangeCallback) {
        if (!client) {
            const SDK_KEY = process.env.SDK_KEY;
            const logger = LoggerWrapper.getLogger();
            client = configcat.createClientWithAutoPoll(SDK_KEY, {
                pollIntervalSeconds: 1,
                logger: logger,
                configChanged: () => {
                    configChangeCallback();
                }
            });
        }
        return client;
    },
    getClient() {
        return client;
    },
    async getValueAsync(key) {
        const configCatClient = this.getClient();
        if (!configCatClient) {
            throw new Error('config cat client is not yet created');
        }
        return await configCatClient.getValueAsync(key, false);
    }
}

Object.freeze(ConfigCatWrapper);

export default ConfigCatWrapper;