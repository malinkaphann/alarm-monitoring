import { ALARM_STATUS } from "shared/constants";

export const ALARMS = [
    {
        name: 'WATER_TANK_1',
        status: ALARM_STATUS.CRITICAL
    },
    {
        name: 'WATER_TANK_2',
        status: ALARM_STATUS.MINOR
    },
    {
        name: 'UV_LAMP',
        status: ALARM_STATUS.MAJOR
    },
    {
        name: 'UV_STERILIZER',
        status: ALARM_STATUS.CRITICAL
    }
];
