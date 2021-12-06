import * as configcat from "configcat-js-ssr";
import MyLogger from "./MyLogger";

let client = null;

const MyConfigCat = {
    createClient(configChangeCallback) {
        if (!client) {
            const SDK_KEY = process.env.SDK_KEY;
            const logger = MyLogger.getLogger();
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
        return await this.getClient().getValueAsync(key, false);
    }
}
Object.freeze(MyConfigCat);

export default MyConfigCat;