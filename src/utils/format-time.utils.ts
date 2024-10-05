import dayjs from 'dayjs';
import UTCPlugin from 'dayjs/plugin/utc';
import TimeZonePlugin from 'dayjs/plugin/timezone';

dayjs.extend(UTCPlugin);
dayjs.extend(TimeZonePlugin);
dayjs.tz.setDefault('Europe/Moscow');

export const formatTime = dayjs.tz;
