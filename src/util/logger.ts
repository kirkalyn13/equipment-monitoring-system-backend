import { createLogger, format, transports } from 'winston'

const { combine, timestamp, errors, json, colorize, printf } = format

const isDev = process.env.NODE_ENV !== 'production'

const devFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    return `${timestamp} [${level}]: ${stack || message} ${
        Object.keys(meta).length ? JSON.stringify(meta) : ''
    }`
})

export const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp(),
        errors({ stack: true }),
        isDev ? combine(colorize(), devFormat) : json()
    ),
    transports: [
        new transports.Console(),
    ],
})