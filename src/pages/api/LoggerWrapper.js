import * as configcat from "configcat-js-ssr";

const GLOBAL_LOG_LEVEL = process.env.GLOBAL_LOG_LEVEL;
let logger = null;

// https://configcat.com/docs/sdk-reference/js#logging
const LOG_LEVEL = {
    OFF: -1,
    ERROR: 1,
    WARN: 2,
    INFO: 3
};

const LoggerWrapper = {
    getLogger() {
        if (!logger) {
            logger = configcat.createConsoleLogger(GLOBAL_LOG_LEVEL);
        }
        return logger;
    },
    info(msg) {
        if (GLOBAL_LOG_LEVEL >= LOG_LEVEL.INFO) {
            this.getLogger().info(msg);
        }
    },
    warn(msg) {
        if (GLOBAL_LOG_LEVEL >= LOG_LEVEL.WARN) {
            this.getLogger().warn(msg);
        }
    },
    error(msg) {
        if (GLOBAL_LOG_LEVEL >= LOG_LEVEL.ERROR) {
            this.getLogger().error(msg);
        }
    }
}

Object.freeze(LoggerWrapper);

export default LoggerWrapper;