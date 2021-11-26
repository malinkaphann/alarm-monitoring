import { ALARM_STATUS } from "shared/constants";

export const ALARMS = [
    {
        name: 'WATER TANK 1',
        status: ALARM_STATUS.CRITICAL
    },
    {
        name: 'WATER TANK 2',
        status: ALARM_STATUS.MINOR
    },
    {
        name: 'UV LAMP',
        status: ALARM_STATUS.MAJOR
    },
    {
        name: 'UV STERILIZER',
        status: ALARM_STATUS.CRITICAL
    }
];
