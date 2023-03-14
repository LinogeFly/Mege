import log from 'loglevel';
import remote from 'loglevel-plugin-remote';

function json(logEntry: any) {
    const logLevelFrom = (logEntry: any) => {
        switch (logEntry.level.label) {
            case 'warn':
                return 'warning';
            case 'error':
                return 'error';
            default:
                return 'trace';
        }
    };

    return {
        message: logEntry.message,
        level: logLevelFrom(logEntry)
    }
}

remote.apply(log, {
    url: '/api/log',
    level: 'warn',
    format: json
});

export const logError = (message: string) => {
    log.error(message);
}

export const logWarn = (message: string) => {
    log.warn(message);
}
