import { ALARMS } from './AlarmData';
import MyConfigCat from './MyConfigCat';
import MyLogger from './MyLogger';
import MySocketIO from './MySocketIO';

// to avoid error
process.setMaxListeners(0);

const IS_MONITORING_ENABLED_FLAG = 
process.env.NEXT_PUBLIC_IS_MONITORING_ENABLED;

const statusChannel = IS_MONITORING_ENABLED_FLAG;
const alarmChannel = 'alarms';

// broadcast alarms
const sendAlarms = (isMonitoringEnabled, io) => {
    if (isMonitoringEnabled) {
        io.emit(alarmChannel, {
            status: 2000,
            data: ALARMS
        });
    } else {
        io.emit(alarmChannel, {
            status: 3000,
            message: 'alarm monitoring is not available at this moment'
        });
    }
}

// main entry
const ioHandler = async (req, res) => {

    // catch all exceptions
    try {

        // this is a callback which is called everytime 
        // a config is changed at configcat.
        const configChangeHandler = async () => {
            MyLogger.info('config has changed');

            const isMonitoringEnabled = await 
            MyConfigCat.getValueAsync(IS_MONITORING_ENABLED_FLAG);

            MyLogger.info(`FROM ConfigCat: ${IS_MONITORING_ENABLED_FLAG} = 
                ${isMonitoringEnabled}`);

            const io = MySocketIO.getServer();
            if (!io) {
                throw new Error('socket server io is not yet created');
            }

            MyLogger.info(`statusChannel = ${statusChannel} broadcasted message = 
                ${isMonitoringEnabled}`);

            io.emit(statusChannel, isMonitoringEnabled);

            sendAlarms(isMonitoringEnabled, io);
        }

        // when this request handler is accessed for the very first time
        if (!MySocketIO.getServer()) {

            MyLogger.info('socket io server is not yet created; \
                so create one now');

            const io = MySocketIO.createServer(res.socket.server);

            // this should never happens, 
            // but just in case.
            if (!io) {
                throw new Error('unexpected error, \
                    socket io server can not be created');
            }

            // on client connection, get config value
            io.on('connection', async (socket) => {

                // this should never happens, 
                // but just in case.
                if (!MyConfigCat.getClient()) {
                    throw new Error('unexpected error, \
                        config cat client is not yet created');
                }

                const isMonitoringEnabled = await 
                    MyConfigCat.getValueAsync(IS_MONITORING_ENABLED_FLAG);

                MyLogger.info(`FROM ConfigCat: ${IS_MONITORING_ENABLED_FLAG} = 
                ${isMonitoringEnabled}`);

                socket.emit(statusChannel, isMonitoringEnabled)
                sendAlarms(isMonitoringEnabled, socket);
            });

            MyLogger.info('configcat client is not yet created; \
                so create one now');

            MyConfigCat.createClient(configChangeHandler);

            res.end();
        }

        // to handle the GET request from client
        if (req.method === 'GET') {

            // socket io server is supposed to be already created
            const io = MySocketIO.getServer();
            if (!io) {
                throw new Error('socket io is not yet created');
            }

            MyLogger.info('receive a GET request from client');

            const isMonitoringEnabled = await 
                MyConfigCat.getValueAsync(IS_MONITORING_ENABLED_FLAG);

            MyLogger.info(`FROM ConfigCat: ${IS_MONITORING_ENABLED_FLAG} = 
                ${isMonitoringEnabled}`);

            io.emit(statusChannel, isMonitoringEnabled)
            sendAlarms(isMonitoringEnabled, io);

            res.end();
        }

    } catch (error) {

        // can not afford to flush the response everytime
        // there is an exception, so handle it here in one place.
        MyLogger.error(error.message);
        res.end();
    }
}

export default ioHandler;