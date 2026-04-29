import Logger from "../../domain/logging/Logger";

export default class ConsoleLogger implements Logger {
    info(message: string, context?: Record<string, unknown>): void {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, context ?? "");
    }

    warn(message: string, context?: Record<string, unknown>): void {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, context ?? "");
    }

    error(message: string, context?: Record<string, unknown>): void {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, context ?? "");
    }
}
