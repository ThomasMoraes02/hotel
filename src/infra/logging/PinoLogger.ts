import Logger from "../../domain/logging/Logger";
import pino from "pino";

export default class PinoLogger implements Logger {
    private logger: pino.Logger;

    constructor() {
        this.logger = pino();
    }

    info(message: string, context?: Record<string, unknown>): void {
        this.logger.info(context ?? {}, message);
    }

    warn(message: string, context?: Record<string, unknown>): void {
        this.logger.warn(context ?? {}, message);
    }

    error(message: string, context?: Record<string, unknown>): void {
        this.logger.error(context ?? {}, message);
    }
}