/**
 * Configured application logger using Winston.
 *
 * @remarks
 * This logger provides structured logging with environment-based formatting:
 *
 * - In development (`NODE_ENV !== 'production'`):
 *   - Logs are human-readable
 *   - Includes colorized output for better visibility
 *   - Prints timestamps, log level, message, stack traces, and metadata
 *
 * - In production:
 *   - Logs are emitted in JSON format
 *   - Suitable for log aggregation systems (e.g., ELK, Datadog, CloudWatch)
 *
 * The logger automatically:
 * - Adds timestamps to all log entries
 * - Captures and serializes error stack traces
 * - Supports additional metadata via object spreading
 *
 * Log level is controlled via the `LOG_LEVEL` environment variable
 * (defaults to `'info'` if not provided).
 *
 * @example (usage)
 * logger.info('Server started')
 * logger.error('Database connection failed', { error })
 *
 * @returns A configured Winston logger instance.
 */
import { createLogger, format, transports } from 'winston'

const { combine, timestamp, errors, json, colorize, printf } = format

const isDev = process.env.NODE_ENV !== 'production'

const devFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    return `${timestamp} [${level}]: ${stack || message} ${
        Object.keys(meta).length ? JSON.stringify(meta) : ''
    }`
})

const formatConfig = isDev
  ? combine(timestamp(), errors({ stack: true }), colorize(), devFormat)
  : combine(timestamp(), errors({ stack: true }), json())

export const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: formatConfig,
    transports: [
        new transports.Console(),
    ],
})