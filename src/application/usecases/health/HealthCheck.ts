import DatabaseConnection from "../../../infra/database/DatabaseConnection";
import Logger from "../../../domain/logging/Logger";
import { inject } from "../../../infra/di/Registry";

export default class HealthCheck {
    private readonly startTime: number;

    constructor() {
        this.startTime = Date.now();
    }

    @inject("DatabaseConnection")
    private readonly databaseConnection!: DatabaseConnection;

    @inject("Logger")
    private readonly logger!: Logger;

    async execute(): Promise<Output> {
        const databaseStatus = await this.checkDatabase();

        return {
            status: "ok",
            uptime: Math.floor((Date.now() - this.startTime) / 1000),
            timestamp: new Date().toISOString(),
            dependencies: {
                database: databaseStatus
            }
        };
    }

    private async checkDatabase(): Promise<"up" | "down"> {
        try {
            const isAlive = await this.databaseConnection.ping();
            if (isAlive) return "up";
            this.logger.warn("Database ping returned false");
            return "down";
        } catch (error: any) {
            this.logger.error("Database health check failed", { error: error.message });
            return "down";
        }
    }
}

type Output = {
    status: string;
    uptime: number;
    timestamp: string;
    dependencies: {
        database: "up" | "down";
    };
};
