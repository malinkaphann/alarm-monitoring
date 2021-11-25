import { ALARMS } from './AlarmData';
import MyConfigCat from './MyConfigCat';
import MyLogger from './MyLogger';
import MySocketIO from './MySocketIO';

// to avoid error
process.setMaxListeners(0);

const IS_MONITORING_ENABLED_FLAG = process.env.NEXT_PUBLIC_IS_MONITORING_ENABLED;
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

    // this is a callback which is called everytime a config is changed at configcat.
    const configChangeHandler = async () => {
        MyLogger.info('config has changed');

        const isMonitoringEnabled = await MyConfigCat.getValueAsync(IS_MONITORING_ENABLED_FLAG);
        MyLogger.info(`FROM ConfigCat: ${IS_MONITORING_ENABLED_FLAG} = ${isMonitoringEnabled}`);

        const io = MySocketIO.getServer();
        if (!io) {
            MyLogger.error('socket io is not yet created');

            // always flush the response before returning
            res.end();
            return;
        }

        MyLogger.info(`statusChannel = ${statusChannel} broadcasted message = ${isMonitoringEnabled}`);
        io.emit(statusChannel, isMonitoringEnabled);

        sendAlarms(isMonitoringEnabled, io);
    }

    // when this api server is accessed for the very first time
    if (!MySocketIO.getServer()) {

        MyLogger.info('socket io server is not yet created; so create one now');
        const io = MySocketIO.createServer(res.socket.server);

        // on client connection, get config value
        io.on('connection', async (socket) => {

            const isMonitoringEnabled = await MyConfigCat.getValueAsync(IS_MONITORING_ENABLED_FLAG);
            MyLogger.info(`FROM ConfigCat: ${IS_MONITORING_ENABLED_FLAG} = ${isMonitoringEnabled}`);

            socket.emit(statusChannel, isMonitoringEnabled)            
            sendAlarms(isMonitoringEnabled, socket);
        });

        MyLogger.info('configcat client is not yet created; so create one now');
        MyConfigCat.createClient(configChangeHandler);

        res.end();
        return;
    }

    // to handle the GET request from client
    if (req.method === 'GET') {

        const io = MySocketIO.getServer();
        if (!io) {
            MyLogger.error('socket io is not yet created');
            res.end();
            return;
        }

        MyLogger.info('receive a GET request from client');
        const isMonitoringEnabled = await MyConfigCat.getValueAsync(IS_MONITORING_ENABLED_FLAG);
        MyLogger.info(`FROM ConfigCat: ${IS_MONITORING_ENABLED_FLAG} = ${isMonitoringEnabled}`);

        io.emit(statusChannel, isMonitoringEnabled)
        sendAlarms(isMonitoringEnabled, io);

        res.end();
        return;
    }
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default ioHandler;